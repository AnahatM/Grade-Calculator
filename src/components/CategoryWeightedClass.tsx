import { useState, useEffect, useRef } from "react";
import {
  ClassData,
  Category,
  CategoryWeightedAssignment,
} from "../hooks/useClasses";

type CategoryWeightedClassProps = {
  classData: ClassData;
  updateClassData: (data: Partial<ClassData>) => void;
};

export default function CategoryWeightedClass({
  classData,
  updateClassData,
}: CategoryWeightedClassProps) {
  const [assignments, setAssignments] = useState<CategoryWeightedAssignment[]>(
    (classData.data as CategoryWeightedAssignment[]) || []
  );
  const [categories, setCategories] = useState<Category[]>(
    classData.categories || []
  );

  // Use a ref to track if we're handling changes internally
  const isInternalChange = useRef(false);

  useEffect(() => {
    // Skip effect if changes came from within the component
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    setCategories(classData.categories || []);
    setAssignments((classData.data as CategoryWeightedAssignment[]) || []);
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
    isInternalChange.current = true;
    const parsedWeight = parseFloat(weight);
    const newCategory = { name, weight: parsedWeight };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    updateClassData({ categories: updatedCategories });
  };

  const editCategory = (index: number): void => {
    isInternalChange.current = true;
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
      updateClassData({ categories: updatedCategories });
    }
  };

  const deleteCategory = (index: number): void => {
    isInternalChange.current = true;
    if (window.confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter((_, i) => i !== index);
      setCategories(updatedCategories);
      updateClassData({ categories: updatedCategories });
    }
  };

  const addRow = (): void => {
    isInternalChange.current = true;
    const updatedAssignments = [
      ...assignments,
      {
        name: "",
        score: 0,
        total: 0,
        category: categories.length > 0 ? categories[0].name : "",
      } as CategoryWeightedAssignment,
    ];
    setAssignments(updatedAssignments);
    updateClassData({ data: updatedAssignments });
  };

  const addTenRows = (): void => {
    isInternalChange.current = true;
    const newAssignments = Array.from({ length: 10 }, () => ({
      name: "",
      score: 0,
      total: 0,
      category: categories.length > 0 ? categories[0].name : "",
    })) as CategoryWeightedAssignment[];

    setAssignments((prevAssignments) => {
      const updatedAssignments = [...prevAssignments, ...newAssignments];
      updateClassData({ data: updatedAssignments });
      return updatedAssignments;
    });
  };

  const handleRowChange = (
    index: number,
    field: keyof CategoryWeightedAssignment,
    value: string
  ): void => {
    isInternalChange.current = true;
    setAssignments((prevAssignments) => {
      const updatedAssignments = [...prevAssignments];
      if (field === "score" || field === "total") {
        updatedAssignments[index] = {
          ...updatedAssignments[index],
          [field]: Number(value),
        };
      } else {
        updatedAssignments[index] = {
          ...updatedAssignments[index],
          [field]: value,
        };
      }
      updateClassData({ data: updatedAssignments });
      return updatedAssignments;
    });
  };

  const deleteRow = (index: number): void => {
    const updatedAssignments = assignments.filter((_, i) => i !== index);
    setAssignments(updatedAssignments);
    updateClassData({ data: updatedAssignments });
  };

  const calculateTotals = (): { overallPercentage: string } => {
    const totalWeightedScore = categories.reduce((sum, category) => {
      const categoryAssignments = assignments.filter(
        (assignment) => assignment.category === category.name
      );
      const totalScore = categoryAssignments.reduce(
        (sum, assignment) => sum + Number(assignment.score || 0),
        0
      );
      const totalMax = categoryAssignments.reduce(
        (sum, assignment) => sum + Number(assignment.total || 0),
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
    <div className="category-weighted-class table-container neuromorphic accent-border">
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
          {assignments.map((assignment, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="number"
                  value={assignment.score}
                  onChange={(e) =>
                    handleRowChange(index, "score", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={assignment.total}
                  onChange={(e) =>
                    handleRowChange(index, "total", e.target.value)
                  }
                />
              </td>
              <td>
                <select
                  value={assignment.category}
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
