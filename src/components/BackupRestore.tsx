import { type ClassData } from "../hooks/useClasses";
import { useState } from "react";

type BackupRestoreProps = {
  setClasses: React.Dispatch<React.SetStateAction<ClassData[]>>;
};

export default function BackupRestore({ setClasses }: BackupRestoreProps) {
  const [showJsonEditor, setShowJsonEditor] = useState<boolean>(false);
  const [jsonText, setJsonText] = useState<string>("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const getCurrentData = (): string => {
    return JSON.stringify(
      localStorage.getItem("classes")
        ? JSON.parse(localStorage.getItem("classes")!)
        : [],
      null,
      2
    );
  };

  const exportData = () => {
    const dataStr = getCurrentData();
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "grade_calculator_data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedClasses = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedClasses)) {
            // Validate that imported data matches the ClassData structure
            setClasses(importedClasses);
          } else {
            alert("Invalid JSON format: Expected an array of classes.");
          }
        } catch (error) {
          alert(`Invalid JSON file, Error: ${(error as Error).message}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const openJsonEditor = () => {
    setJsonText(getCurrentData());
    setJsonError(null);
    setShowJsonEditor(true);
  };

  const closeJsonEditor = () => {
    setShowJsonEditor(false);
    setJsonError(null);
  };

  const applyJsonChanges = () => {
    try {
      const updatedClasses = JSON.parse(jsonText);
      if (Array.isArray(updatedClasses)) {
        setClasses(updatedClasses);
        setJsonError(null);
        setShowJsonEditor(false);
      } else {
        setJsonError("Invalid JSON format: Expected an array of classes.");
      }
    } catch (error) {
      setJsonError(`Invalid JSON: ${(error as Error).message}`);
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    setJsonError(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(jsonText)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="backup-restore neuromorphic accent-border">
      <h2>Save and Load</h2>
      <div className="backup-restore-buttons">
        <button
          className="neuromorphic btn-accent"
          style={{ padding: "5px 10px" }}
          onClick={exportData}
        >
          Export
        </button>
        <button
          className="neuromorphic"
          style={{ padding: "5px 10px" }}
          onClick={openJsonEditor}
        >
          View / Edit Data
        </button>
        <input
          type="file"
          accept="application/json"
          onChange={importData}
          className="neuromorphic-inset"
        />
      </div>

      {showJsonEditor && (
        <div className="json-editor-overlay">
          <div className="json-editor-popup neuromorphic">
            <h3>Edit JSON Data</h3>
            <div className="json-editor-container">
              <button
                className="copy-button neuromorphic"
                onClick={copyToClipboard}
              >
                {copySuccess ? "Copied!" : "Copy"}
              </button>
              <textarea
                value={jsonText}
                onChange={handleJsonChange}
                className="neuromorphic-inset"
                rows={20}
                spellCheck={false}
              ></textarea>
            </div>
            {jsonError && <div className="json-error">{jsonError}</div>}
            <div className="json-editor-actions">
              <button
                className="neuromorphic btn-positive"
                onClick={applyJsonChanges}
              >
                Apply Changes
              </button>
              <button
                className="neuromorphic btn-negative"
                onClick={closeJsonEditor}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
