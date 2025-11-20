// src/App.jsx
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { generateAnalysisReport, generateCombinedAnalysisReport } from "./pdfGenerator";

const BACKEND_URL = "http://127.0.0.1:5000//predict";

function App() {
  const [items, setItems] = useState([]); // {id, file, url, type, status, result, error}
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  // ---------- helpers ----------

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setGlobalError(null);

    setItems((prev) => [
      ...prev,
      ...files.map((file) => {
        const isImage = file.type.startsWith("image/");
        const previewUrl = isImage ? URL.createObjectURL(file) : null;
        return {
          id: crypto.randomUUID(),
          file,
          type: file.type,
          name: file.name,
          previewUrl,
          status: "pending", // pending | loading | done | error
          result: null,
          error: null,
        };
      }),
    ]);
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = ""; // reset input
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle paste (Ctrl+V) for images
  const handlePaste = useCallback((e) => {
    const files = Array.from(e.clipboardData?.files || []);
    if (files.length) {
      addFiles(files);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  // Clean up object URLs when items change
  useEffect(() => {
    return () => {
      items.forEach((it) => {
        if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
      });
    };
  }, [items]);

  const clearAll = () => {
    items.forEach((it) => {
      if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
    });
    setItems([]);
    setGlobalError(null);
  };

  const downloadReport = async (item) => {
    if (!item.result) return;
    try {
      await generateAnalysisReport(item);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setGlobalError("Failed to generate PDF report. Please try again.");
    }
  };

  const downloadAllReports = async () => {
    const completedItems = items.filter(item => item.status === 'done' && item.result);
    if (!completedItems.length) {
      setGlobalError("No completed analyses to download.");
      return;
    }
    try {
      await generateCombinedAnalysisReport(completedItems);
    } catch (err) {
      console.error("Error generating combined PDF:", err);
      setGlobalError("Failed to generate combined PDF report. Please try again.");
    }
  };

  // ---------- API call ----------

  const analyzeAll = async () => {
    if (!items.length) {
      setGlobalError("Please add at least one file.");
      return;
    }

    setIsAnalyzing(true);
    setGlobalError(null);

    const updated = [...items];

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      if (item.status === "done") continue;

      updated[i] = { ...item, status: "loading", error: null };
      setItems([...updated]);

      const formData = new FormData();
      formData.append("image", item.file);

      try {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || `Server error: ${res.status}`);
        }

        const data = await res.json();

        updated[i] = {
          ...updated[i],
          status: "done",
          result: data,
        };
      } catch (err) {
        updated[i] = {
          ...updated[i],
          status: "error",
          error: err.message || "Request failed",
        };
        setGlobalError("Some files failed. Check details below.");
      }

      setItems([...updated]);
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Industrial Defect Detector</h1>
        <p>
          Upload metal surface images (or PDFs) to detect defects using your AI
          model. You can <strong>drag &amp; drop</strong>,{" "}
          <strong>paste (Ctrl+V)</strong>, or <strong>browse files</strong>.
        </p>
      </header>

      <main>
        <section
          className={`dropzone ${isDragging ? "dropzone--active" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="dropzone-inner">
            <p className="dropzone-title">
              Drag &amp; drop images or PDFs here
            </p>
            <p className="dropzone-sub">
              or click to select files, or press <kbd>Ctrl</kbd> + <kbd>V</kbd>{" "}
              to paste
            </p>
            <input
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
        </section>

        <div className="actions">
          <button
            className="btn primary"
            onClick={analyzeAll}
            disabled={isAnalyzing || !items.length}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze All"}
          </button>
          <button
            className="btn secondary"
            onClick={clearAll}
            disabled={isAnalyzing || !items.length}
          >
            Clear
          </button>
        </div>

        {globalError && <p className="global-error">{globalError}</p>}

        <section className="results">
          {!items.length && (
            <p className="hint">
              No files yet. Drop images/PDFs, paste, or select from device.
            </p>
          )}

          {items.map((item) => (
            <div className="result-card" key={item.id}>
              <div className="result-header">
                <div>
                  <h3 className="file-name">{item.name}</h3>
                  <p className="file-type">{item.type || "Unknown type"}</p>
                </div>
                <span
                  className={`status-pill status-${item.status}`}
                  title={item.error || ""}
                >
                  {item.status === "pending" && "Pending"}
                  {item.status === "loading" && "Processing"}
                  {item.status === "done" && "Done"}
                  {item.status === "error" && "Error"}
                </span>
              </div>

              <div className="result-body">
                <div className="preview-column">
                  <h4>Original</h4>
                  {item.previewUrl && item.type.startsWith("image/") ? (
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="preview-image"
                    />
                  ) : (
                    <div className="preview-placeholder">
                      <span>Preview not available</span>
                      <span className="small">
                        {item.type === "application/pdf"
                          ? "PDF file"
                          : "Non-image file"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="analysis-column">
                  {item.status === "done" && item.result && (
                    <>
                      <div className="action-buttons">
                        <button
                          className="btn download-btn"
                          onClick={() => downloadReport(item)}
                          title="Download analysis as PDF report"
                        >
                          📥 Download Report
                        </button>
                      </div>

                      <div className="prediction">
                        <h4>Prediction</h4>
                        <p>
                          Defect type:{" "}
                          <strong>{item.result.predicted_class}</strong>
                        </p>
                      </div>

                      {item.result.probabilities && (
                        <div className="probabilities">
                          <h4>Class Probabilities</h4>
                          <ul>
                            {Object.entries(
                              item.result.probabilities
                            )
                              .sort((a, b) => b[1] - a[1])
                              .map(([cls, prob]) => (
                                <li key={cls}>
                                  <span>{cls}</span>
                                  <span>
                                    {(prob * 100).toFixed(1)}%
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {item.result.grad_cam_image_base64 && (
                        <div className="gradcam">
                          <h4>Grad-CAM</h4>
                          <img
                            src={`data:image/png;base64,${item.result.grad_cam_image_base64}`}
                            alt="Grad-CAM"
                            className="gradcam-image"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {item.status === "loading" && (
                    <p className="info">Running model...</p>
                  )}
                  {item.status === "pending" && (
                    <p className="info">
                      Click &ldquo;Analyze All&rdquo; to run the model.
                    </p>
                  )}
                  {item.status === "error" && (
                    <p className="error">
                      {item.error || "Error while processing this file."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

        {items.length > 1 && items.some(item => item.status === 'done') && (
          <div className="batch-actions">
            <button
              className="btn download-all-btn"
              onClick={downloadAllReports}
              title="Download all analyses as a single PDF report"
            >
              📦 Download All Reports as PDF
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
