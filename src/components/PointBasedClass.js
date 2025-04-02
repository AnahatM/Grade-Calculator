import React, { useState, useEffect } from "react";
import PredictNextGrade from "./PredictNextGrade";

function PointBasedClass({ classData, updateClassData, gradeScale }) {
  const [rows, setRows] = useState(classData.data || []);

  useEffect(() => {
    updateClassData({ data: rows });
  }, [rows, updateClassData]);

  const addRow = () => {
    setRows([...rows, { score: "", total: "" }]);
  };

  const addTenRows = () => {
    const newRows = Array(10).fill({ score: "", total: "" });
    setRows([...rows, ...newRows]);
  };

  const updateRow = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const totalScore = rows.reduce(
      (sum, row) => sum + Number(row.score || 0),
      0
    );
    const totalMax = rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
    const percentage =
      totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(2) : 0;
    return { totalScore, totalMax, percentage };
  };

  const { totalScore, totalMax, percentage } = calculateTotals();

  return (
    <div>
      <h3>Point-Based Class</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Score</th>
            <th>Total</th>
            <th>Percentage</th>
            <th>Actions</th>
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
                {row.total > 0
                  ? ((row.score / row.total) * 100).toFixed(2)
                  : "0.00"}
                %
              </td>
              <td>
                <button onClick={() => deleteRow(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
      <button onClick={addTenRows}>Add 10 Rows</button>
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

export default PointBasedClass;
