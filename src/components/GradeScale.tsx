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
    </div>
  );
}
