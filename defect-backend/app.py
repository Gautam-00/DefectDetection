import io
import base64
import numpy as np
from PIL import Image
import cv2

import tensorflow as tf
from tensorflow import keras

from flask import Flask, request, jsonify
from flask_cors import CORS

from tensorflow.keras.applications.resnet50 import preprocess_input

def preprocess_input(x):
    return tf.keras.applications.resnet50.preprocess_input(x)

# -------------------- CONFIG -------------------- #
IMG_SIZE = (224, 224)  # Must match the model input size

# IMPORTANT: must match the training order of classes
CLASS_NAMES = [
    'crazing',
    'inclusion',
    'patches',
    'pitted_surface',
    'rolled_in_scale',   # <- fixed underscore (NOT "rolled-in_scale")
    'scratches'
]

MODEL_PATH = 'neu_defect_resnet50.h5'  # Path to your trained Keras model
LAST_CONV_LAYER_NAME = 'conv5_block3_out'  # kept for clarity, not directly used

# -------------------- FLASK APP -------------------- #
app = Flask(__name__)
CORS(app)

# Global model variables
model = None
base_model = None


# -------------------- MODEL LOADING -------------------- #
def load_model():
    """
    Load the trained model and extract the base ResNet50 part.
    """
    global model, base_model

    model = keras.models.load_model(
    MODEL_PATH,
    custom_objects={"preprocess_input": preprocess_input}
)
    base_model = model.get_layer('resnet50')  # ResNet50 base inside your full model

    print(f"Model '{MODEL_PATH}' loaded successfully.")
    print(f"Base model for Grad-CAM: {base_model.name}")
    print(f"Last conv layer name (for reference): {LAST_CONV_LAYER_NAME}")


# -------------------- HELPER: PREPROCESS IMAGE -------------------- #
def preprocess_image(image_bytes):
    """
    Read uploaded file bytes, resize to IMG_SIZE, and prepare for model.
    - Returns:
        original_resized_img: np.array (H, W, 3) uint8 for Grad-CAM overlay
        img_batch_for_inference: np.array (1, H, W, 3) float32 for model.predict
    NOTE:
    We DO NOT call preprocess_input here, because the model already has
    data_augmentation + resnet50_preprocess_input inside it.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize(IMG_SIZE)

    original_resized_img = np.array(img)                 # (224,224,3) uint8
    img_array = original_resized_img.astype("float32")   # convert to float
    img_batch_for_inference = np.expand_dims(img_array, axis=0)  # (1,224,224,3)

    return original_resized_img, img_batch_for_inference


# -------------------- HELPER: GRAD-CAM -------------------- #
def make_gradcam_heatmap(img_array, model, base_model, last_conv_layer_name, pred_index=None):
    """
    Working Grad-CAM implementation from your notebook.

    img_array: numpy array or tf.Tensor of shape (1, H, W, 3), dtype float32
    model: full Keras model (prediction head + base_model inside)
    base_model: the ResNet50 base_model object (the same used when building model)
    last_conv_layer_name: name of the target convolutional layer within base_model
    Returns: heatmap as numpy array (h, w) with values in [0,1]
    """

    # Ensure float32 tensor
    img_tensor = tf.convert_to_tensor(img_array, dtype=tf.float32)

    with tf.GradientTape() as tape:
        # 1. Apply the SAME preprocessing as in the original model
        x = model.get_layer("data_augmentation")(img_tensor, training=False)
        x = model.get_layer("resnet50_preprocess_input")(x)

        # 2. Forward through base_model (ResNet50)
        resnet_output_features = base_model(x, training=False)
        conv_outputs = resnet_output_features  # base_model output is conv5_block3_out

        # 3. Watch conv_outputs for gradients
        tape.watch(conv_outputs)

        # 4. Pass through classification head (same layers as model head)
        x_classifier = model.get_layer("global_average_pooling2d")(resnet_output_features)
        x_classifier = model.get_layer("dropout")(x_classifier)
        x_classifier = model.get_layer("dense")(x_classifier)
        x_classifier = model.get_layer("dropout_1")(x_classifier)
        preds = model.get_layer("predictions")(x_classifier)

        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    # Gradients of class score w.r.t conv_outputs
    grads = tape.gradient(class_channel, conv_outputs)

    # If gradients are None, something is wrong with the graph
    if grads is None:
        tf.print("Warning: Gradients are None. Returning zero heatmap.")
        return np.zeros(conv_outputs.shape[1:3])

    # Global average pooling over gradients
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # Weighted sum of feature maps
    features = conv_outputs[0]  # remove batch dimension: (h, w, c)
    heatmap = features @ pooled_grads[..., tf.newaxis]  # (h, w, 1)
    heatmap = tf.squeeze(heatmap)  # (h, w)

    # Normalize heatmap
    heatmap = tf.maximum(heatmap, 0)
    max_val = tf.reduce_max(heatmap)
    if tf.equal(max_val, 0):
        return np.zeros_like(heatmap.numpy())
    heatmap = heatmap / max_val

    return heatmap.numpy()


# -------------------- HELPER: OVERLAY HEATMAP -------------------- #
def superimpose_gradcam(original_img, heatmap, alpha=0.4):
    """
    original_img: numpy array (H,W,3) in [0,255] or [0,1]
    heatmap: (h,w) in [0,1]
    Returns: superimposed image as numpy array (H,W,3) in uint8
    """
    img = original_img.copy()
    if img.max() <= 1.0:
        img = (img * 255).astype("uint8")
    else:
        img = img.astype("uint8")

    heatmap_resized = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap_uint8 = np.uint8(255 * heatmap_resized)
    heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    superimposed_img = cv2.addWeighted(heatmap_color, alpha, img, 1 - alpha, 0)

    return superimposed_img


# -------------------- ROUTES -------------------- #
@app.route("/")
def home():
    return "Flask app is running! Model loading status: " + ("Loaded" if model else "Not Loaded")


@app.route("/predict", methods=["POST"])
def predict():
    """
    POST /predict
    Body: form-data with key "image" containing an image file.
    Returns JSON:
      {
        "predicted_class": "...",
        "probabilities": {class_name: prob, ...},
        "grad_cam_image_base64": "data..."
      }
    """
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected image file"}), 400

    try:
        # 1. Read and preprocess
        img_bytes = file.read()
        original_resized_img, img_batch_for_inference = preprocess_image(img_bytes)

        # 2. Model inference
        predictions = model.predict(img_batch_for_inference)
        pred_probs = predictions[0].tolist()
        predicted_index = int(np.argmax(predictions[0]))
        predicted_class = CLASS_NAMES[predicted_index]

        # 3. Grad-CAM heatmap
        heatmap = make_gradcam_heatmap(
            img_batch_for_inference,
            model,
            base_model,
            LAST_CONV_LAYER_NAME,
            pred_index=predicted_index
        )

        # 4. Overlay heatmap
        superimposed_img_np = superimpose_gradcam(original_resized_img, heatmap)

        # 5. Encode Grad-CAM image as base64 PNG
        _, buffer = cv2.imencode(".png", cv2.cvtColor(superimposed_img_np, cv2.COLOR_RGB2BGR))
        gradcam_b64 = base64.b64encode(buffer).decode("utf-8")

        # 6. Build JSON response
        response = {
            "predicted_class": predicted_class,
            "probabilities": dict(zip(CLASS_NAMES, pred_probs)),
            "grad_cam_image_base64": gradcam_b64
        }
        return jsonify(response), 200

    except Exception as e:
        app.logger.error(f"Error during prediction: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


# -------------------- STARTUP -------------------- #
# Load model once when the app starts
with app.app_context():
    load_model()

if __name__ == "__main__":
    # Development server; for production use gunicorn/uwsgi, etc.
    app.run(host="0.0.0.0", port=5000, debug=True)
