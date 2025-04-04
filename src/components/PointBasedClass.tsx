import { useState, useEffect } from "react";

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
  const [rows, setRows] = useState(classData.data || []);

  useEffect(() => {
    if (classData.data !== rows) {
      setRows(classData.data || []);
    }
  }, [classData]);

  const handleRowChange = (
    index: number,
    field: "score" | "total",
    value: string
  ): void => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
    updateClassData({ data: updatedRows });
  };

  const addRow = (): void => {
    setRows([...rows, { score: "", total: "" }]);
  };

  const addTenRows = (): void => {
    const newRows = Array.from({ length: 10 }, () => ({
      score: "",
      total: "",
    }));
    setRows((prevRows) => [...prevRows, ...newRows]);
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
            <th></th>
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
                  onChange={(e) =>
                    handleRowChange(index, "score", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.total}
                  onChange={(e) =>
                    handleRowChange(index, "total", e.target.value)
                  }
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
      <p
        className="neuromorphic"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        Current Grade: {percentage}% // (
        {Object.entries(gradeScale).find(
          ([, minPercentage]) => (totalScore / totalMax) * 100 >= minPercentage
        )?.[0] || "F"}
        ) // {totalScore}/{totalMax}
      </p>
    </div>
  );
}
