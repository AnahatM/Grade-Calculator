import { useState, useEffect } from "react";
import PredictNextGrade from "./PredictNextGrade.tsx";

// Define types for props and rows
type PointBasedClassProps = {
  classData: {
    data: { score: string; total: string }[];
  };
  updateClassData: (data: { data: { score: string; total: string }[] }) => void;
  gradeScale: Record<string, number>;
};

export default function PointBasedClass({
  classData,
  updateClassData,
  gradeScale,
}: PointBasedClassProps) {
  const [rows, setRows] = useState<{ score: string; total: string }[]>(
    classData.data || []
  );

  useEffect(() => {
    updateClassData({ data: rows });
  }, [rows, updateClassData]);

  const addRow = (): void => {
    setRows([...rows, { score: "", total: "" }]);
  };

  const addTenRows = (): void => {
    const newRows = Array(10).fill({ score: "", total: "" });
    setRows([...rows, ...newRows]);
  };

  const updateRow = (
    index: number,
    field: "score" | "total",
    value: string
  ): void => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const deleteRow = (index: number): void => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const calculateTotals = (): {
    totalScore: number;
    totalMax: number;
    percentage: number;
  } => {
    const totalScore = rows.reduce(
      (sum, row) => sum + Number(row.score || 0),
      0
    );
    const totalMax = rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
    const percentage =
      totalMax > 0 ? parseFloat(((totalScore / totalMax) * 100).toFixed(2)) : 0;
    return { totalScore, totalMax, percentage };
  };

  const { totalScore, totalMax, percentage } = calculateTotals();

  return (
    <div className="table-container neuromorphic">
      <h2>Point-Based Class</h2>
      <table className="neuromorphic">
        <thead>
          <tr>
            <th>#</th>
            <th>Score</th>
            <th>Total</th>
            <th>Percent</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="number"
                  value={row.score}
                  onChange={(e) => updateRow(index, "score", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.total}
                  onChange={(e) => updateRow(index, "total", e.target.value)}
                />
              </td>
              <td>
                {Number(row.total) > 0
                  ? ((Number(row.score) / Number(row.total)) * 100).toFixed(2)
                  : "0.00"}
                %
              </td>
              <td>
                <button onClick={() => deleteRow(index)}>Del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="neuromorphic" onClick={addRow}>
        Add Row
      </button>
      <button className="neuromorphic" onClick={addTenRows}>
        Add 10 Rows
      </button>
      <div>
        <p>Total Score: {totalScore}</p>
        <p>Total Max: {totalMax}</p>
        <p>Overall Percentage: {percentage}%</p>
      </div>
      <PredictNextGrade
        totalScore={totalScore}
        totalMax={totalMax}
        gradeScale={gradeScale}
      />
    </div>
  );
}
