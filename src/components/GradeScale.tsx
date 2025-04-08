type GradeScaleProps = {
  gradeScale: Record<string, number>;
  setGradeScale: (newScale: Record<string, number>) => void;
};

export default function GradeScale({
  gradeScale,
  setGradeScale,
}: GradeScaleProps) {
  const updateGrade = (grade: string, minPercentage: number): void => {
    setGradeScale({ ...gradeScale, [grade]: minPercentage });
  };

  const resetToDefaults = (): void => {
    const defaultGradeScale = {
      "A+": 97,
      A: 93,
      "A-": 90,
      "B+": 87,
      B: 83,
      "B-": 80,
      "C+": 77,
      C: 73,
      "C-": 70,
      "D+": 67,
      D: 63,
      "D-": 60,
      F: 0,
    };

    if (window.confirm("Reset grade thresholds to default values?")) {
      setGradeScale(defaultGradeScale);
    }
  };

  return (
    <div className="grade-scale neuromorphic table-container accent-border">
      <h2>Letter Grades</h2>
      <table className="neuromorphic">
        <thead>
          <tr>
            <th>Grade</th>
            <th>Minimum Percentage</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(gradeScale).map(([grade, percentage]) => (
            <tr key={grade}>
              <td style={{ width: "50%" }}>{grade}</td>
              <td style={{ width: "50%" }}>
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => updateGrade(grade, Number(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p
        className="neuromorphic"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        You can adjust the above thresholds for letter grades.
      </p>
      <button
        onClick={resetToDefaults}
        className="neuromorphic btn-warning"
        style={{ marginTop: "5px", marginBottom: "15px" }}
      >
        Reset to Default Values
      </button>
    </div>
  );
}
