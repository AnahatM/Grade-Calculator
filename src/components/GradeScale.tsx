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
    <div>
      <h3>Letter Grade Conversion Table</h3>
      <table>
        <thead>
          <tr>
            <th>Grade</th>
            <th>Minimum Percentage</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(gradeScale).map(([grade, percentage]) => (
            <tr key={grade}>
              <td>{grade}</td>
              <td>
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
      <p>
        Adjust the thresholds for finer grades like A+, A, A-, B+, etc., by
        modifying the values in the table above.
      </p>
    </div>
  );
}
