import React, { useState, useEffect } from "react";

function CategoryWeightedClass({ classData, updateClassData }) {
  const [categories, setCategories] = useState(classData.categories || []);
  const [rows, setRows] = useState(classData.data || []);

  useEffect(() => {
    updateClassData({ categories, data: rows });
  }, [categories, rows, updateClassData]);

  const parseWeight = (input) => {
    if (input.includes("%")) {
      return parseFloat(input) / 100;
    } else if (input.includes(".")) {
      return parseFloat(input);
    } else {
      return parseFloat(input) / 100;
    }
  };

  const addCategory = (name, weight) => {
    const parsedWeight = parseWeight(weight);
    setCategories([...categories, { name, weight: parsedWeight * 100 }]);
  };

  const editCategory = (index) => {
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
    }
  };

  const deleteCategory = (index) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  const addRow = () => {
    setRows([...rows, { score: "", total: "", category: "" }]);
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

  return (
    <div>
      <h3>Category-Weighted Class</h3>
      <div>
        <h4>Categories</h4>
        <ul>
          {categories.map((cat, index) => (
            <li key={index}>
              {cat.name} - {cat.weight}%
              <button onClick={() => editCategory(index)}>Edit</button>
              <button onClick={() => deleteCategory(index)}>Delete</button>
            </li>
          ))}
        </ul>
        <button
          onClick={() =>
            addCategory(
              prompt("Category Name:"),
              prompt("Weight (e.g., 25%, 0.25, or 25):")
            )
          }
        >
          Add Category
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Score</th>
            <th>Total</th>
            <th>Category</th>
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
                <select
                  value={row.category}
                  onChange={(e) => updateRow(index, "category", e.target.value)}
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
                <button onClick={() => deleteRow(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
      <div>
        <h4>Category Totals</h4>
        <ul>
          {categories.map((cat, index) => (
            <li key={index}>
              {cat.name}: {cat.weight}%
            </li>
          ))}
        </ul>
        <p>Overall Percentage: {overallPercentage}%</p>
      </div>
    </div>
  );
}

export default CategoryWeightedClass;
