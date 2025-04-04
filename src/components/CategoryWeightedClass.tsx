import { useState, useEffect } from "react";

type Category = {
  name: string;
  weight: number;
};

type Row = {
  score: string;
  total: string;
  category: string;
};

type CategoryWeightedClassProps = {
  classData: {
    categories: Category[];
    data: Row[];
  };
  updateClassData: (data: { categories: Category[]; data: Row[] }) => void;
};

export default function CategoryWeightedClass({
  classData,
  updateClassData,
}: CategoryWeightedClassProps) {
  const [categories, setCategories] = useState(classData.categories || []);
  const [rows, setRows] = useState(classData.data || []);

  useEffect(() => {
    if (
      JSON.stringify(classData.categories) !== JSON.stringify(categories) ||
      JSON.stringify(classData.data) !== JSON.stringify(rows)
    ) {
      setCategories(classData.categories || []);
      setRows(classData.data || []);
    }
  }, [classData]);

  const parseWeight = (input: string): number => {
    if (input.includes("%")) {
      return parseFloat(input) / 100;
    } else if (input.includes(".")) {
      return parseFloat(input);
    } else {
      return parseFloat(input) / 100;
    }
  };

  const addCategory = (name: string, weight: string): void => {
    const parsedWeight = parseFloat(weight);
    const newCategory = { name, weight: parsedWeight };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    updateClassData({ categories: updatedCategories, data: rows });
  };

  const editCategory = (index: number): void => {
    const newName = prompt("Enter new category name:", categories[index].name);
    const newWeight = prompt(
      "Enter new weight for the category (e.g., 25%, 0.25, or 25):",
      categories[index].weight + "%"
    );
    if (newName && newWeight) {
      const parsedWeight = parseWeight(newWeight);
      const updatedCategories = categories.map((cat, i) =>
        i === index
          ? { ...cat, name: newName, weight: parsedWeight * 100 }
          : cat
      );
      setCategories(updatedCategories);
      updateClassData({ categories: updatedCategories, data: rows });
    }
  };

  const deleteCategory = (index: number): void => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter((_, i) => i !== index);
      setCategories(updatedCategories);
      updateClassData({ categories: updatedCategories, data: rows });
    }
  };

  const addRow = (): void => {
    const updatedRows = [...rows, { score: "", total: "", category: "" }];
    setRows(updatedRows);
    updateClassData({ categories, data: updatedRows });
  };

  const addTenRows = (): void => {
    const newRows = Array.from({ length: 10 }, () => ({
      score: "",
      total: "",
      category: categories.length > 0 ? categories[0].name : "",
    }));
    setRows((prevRows) => {
      const updatedRows = [...prevRows, ...newRows];
      updateClassData({ categories, data: updatedRows });
      return updatedRows;
    });
  };

  const handleRowChange = (
    index: number,
    field: keyof Row,
    value: string
  ): void => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = { ...updatedRows[index], [field]: value };
      updateClassData({ data: updatedRows, categories });
      return updatedRows;
    });
  };

  const deleteRow = (index: number): void => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    updateClassData({ categories, data: updatedRows });
  };

  const calculateTotals = (): { overallPercentage: string } => {
    const totalWeightedScore = categories.reduce((sum, category) => {
      const categoryRows = rows.filter((row) => row.category === category.name);
      const totalScore = categoryRows.reduce(
        (sum, row) => sum + Number(row.score || 0),
        0
      );
      const totalMax = categoryRows.reduce(
        (sum, row) => sum + Number(row.total || 0),
        0
      );
      const weight = category.weight / 100;
      const weightedScore = totalMax > 0 ? (totalScore / totalMax) * weight : 0;
      return sum + weightedScore;
    }, 0);

    return { overallPercentage: (totalWeightedScore * 100).toFixed(2) };
  };

  const { overallPercentage } = calculateTotals();

  const gradeScale: { [grade: string]: number } = {
    A: 90,
    B: 80,
    C: 70,
    D: 60,
    F: 0,
  };

  return (
    <div className="category-weighted-class table-container neuromorphic">
      <h2>Category-Weighted Class</h2>

      {/* Categories Section */}
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <table className="neuromorphic">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Weight (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={index}>
                <td>{cat.name}</td>
                <td>{cat.weight}</td>
                <td>
                  <button onClick={() => editCategory(index)}>Edit</button>
                  <button onClick={() => deleteCategory(index)}>Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="neuromorphic"
          onClick={() =>
            addCategory(
              prompt("Category Name:") || "",
              prompt("Weight (e.g., 25%, 0.25, or 25):") || ""
            )
          }
        >
          Add Category
        </button>
      </div>

      {/* Scores Table */}
      <table className="table-container neuromorphic">
        <thead>
          <tr>
            <th></th>
            <th>Score</th>
            <th>Total</th>
            <th>Category</th>
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
                <select
                  value={row.category}
                  onChange={(e) =>
                    handleRowChange(index, "category", e.target.value)
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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

      {/* Current Grade Section */}
      <p
        className="neuromorphic"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        Current Grade: {overallPercentage}% // (
        {Object.entries(gradeScale).find(
          ([, minPercentage]) => parseFloat(overallPercentage) >= minPercentage
        )?.[0] || "F"}
        )
      </p>
    </div>
  );
}
