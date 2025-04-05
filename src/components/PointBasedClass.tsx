import { useState, useEffect, useRef } from "react";
import { ClassData, PointBasedAssignment } from "../hooks/useClasses";

type PointBasedClassProps = {
  classData: ClassData;
  updateClassData: (data: Partial<ClassData>) => void;
  gradeScale: Record<string, number>;
};

export default function PointBasedClass({
  classData,
  updateClassData,
  gradeScale,
}: PointBasedClassProps) {
  const [rows, setRows] = useState<PointBasedAssignment[]>(
    (classData.data as PointBasedAssignment[]) || []
  );

  // Use a ref to track if we're handling changes internally
  const isInternalChange = useRef(false);

  useEffect(() => {
    // Skip effect if changes came from within the component
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    setRows((classData.data as PointBasedAssignment[]) || []);
  }, [classData]);

  const handleRowChange = (
    index: number,
    field: "score" | "total",
    value: string
  ): void => {
    isInternalChange.current = true;
    const updatedRows = [...rows];
    updatedRows[index][field] = Number(value);
    setRows(updatedRows);
    updateClassData({ data: updatedRows });
  };

  const addAssignment = (): void => {
    isInternalChange.current = true;
    const newAssignment: PointBasedAssignment = {
      name: "",
      score: 0,
      total: 0,
    };
    setRows((prevRows) => {
      const updatedRows = [...prevRows, newAssignment];
      updateClassData({ data: updatedRows });
      return updatedRows;
    });
  };

  const addTenAssignments = (): void => {
    isInternalChange.current = true;
    const newAssignments = Array.from({ length: 10 }, () => ({
      name: "",
      score: 0,
      total: 0,
    }));
    setRows((prevRows) => {
      const updatedRows = [...prevRows, ...newAssignments];
      updateClassData({ data: updatedRows });
      return updatedRows;
    });
  };

  const deleteRow = (index: number): void => {
    isInternalChange.current = true;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    updateClassData({ data: updatedRows });
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
      <button className="neuromorphic" onClick={addAssignment}>
        Add Assignment
      </button>
      <button className="neuromorphic" onClick={addTenAssignments}>
        Add 10 Assignments
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
