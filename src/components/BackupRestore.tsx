type BackupRestoreProps = {
  setClasses: (classes: { name: string; grade: number }[]) => void;
};

export default function BackupRestore({ setClasses }: BackupRestoreProps) {
  const exportData = () => {
    const dataStr = JSON.stringify([], null, 2); // Replace with actual data
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

  return (
    <div className="backup-restore neuromorphic">
      <h2>Save and Load</h2>
      <button
        className="neuromorphic"
        style={{ padding: "5px 10px" }}
        onClick={exportData}
      >
        Export Data
      </button>
      <input
        type="file"
        accept="application/json"
        onChange={importData}
        className="neuromorphic-inset"
      />
    </div>
  );
}
