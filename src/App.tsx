import { useState, useEffect, ChangeEvent } from "react";
import PointBasedClass from "./components/PointBasedClass.tsx";
import CategoryWeightedClass from "./components/CategoryWeightedClass.tsx";
import GradeScale from "./components/GradeScale.tsx";

import "./App.css";

// Define types for class data and grade scale
type ClassData = {
  name: string;
  type: "point-based" | "category-weighted";
  data: any[]; // Replace `any` with a more specific type if possible
  categories: any[]; // Replace `any` with a more specific type if possible
};

type GradeScale = Record<string, number>;

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [classes, setClasses] = useState<ClassData[]>(() => {
    const savedClasses = localStorage.getItem("classes");
    return savedClasses ? (JSON.parse(savedClasses) as ClassData[]) : [];
  });
  const [newClassName, setNewClassName] = useState<string>("");
  const [newClassType, setNewClassType] = useState<
    "point-based" | "category-weighted"
  >("point-based");
  const [activeClassIndex, setActiveClassIndex] = useState<number>(0);
  const [gradeScale, setGradeScale] = useState<GradeScale>({
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
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);

  const toggleTheme = (): void => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const addClass = (): void => {
    if (newClassName.trim() === "") return;
    setClasses([
      ...classes,
      { name: newClassName, type: newClassType, data: [], categories: [] },
    ]);
    setNewClassName("");
  };

  const switchClass = (index: number): void => {
    setActiveClassIndex(index);
  };

  const updateClassData = (data: Partial<ClassData>): void => {
    const updatedClasses = classes.map((cls, index) =>
      index === activeClassIndex ? { ...cls, ...data } : cls
    );
    setClasses(updatedClasses);
  };

  const editClassName = (index: number): void => {
    const newName = prompt("Enter new class name:", classes[index].name);
    if (newName) {
      const updatedClasses = classes.map((cls, i) =>
        i === index ? { ...cls, name: newName } : cls
      );
      setClasses(updatedClasses);
    }
  };

  const deleteClass = (index: number): void => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      const updatedClasses = classes.filter((_, i) => i !== index);
      setClasses(updatedClasses);
      if (activeClassIndex === index) {
        setActiveClassIndex(0);
      }
    }
  };

  const exportData = (): void => {
    const dataStr = JSON.stringify(classes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "grade_calculator_data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedClasses = JSON.parse(
            e.target?.result as string
          ) as ClassData[];
          setClasses(importedClasses);
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="App">
      <nav>
        <header>
          <h1>Grade Calculator</h1>
          <p>by Anahat Mudgal</p>
        </header>
        <button onClick={toggleTheme}>{theme === "light" ? "🌙" : "🌞"}</button>
      </nav>
      <main>
        <div>
          <h2>Add a New Class</h2>
          <input
            type="text"
            placeholder="Class Name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <select
            value={newClassType}
            onChange={(e) =>
              setNewClassType(
                e.target.value as "point-based" | "category-weighted"
              )
            }
          >
            <option value="point-based">Point-Based</option>
            <option value="category-weighted">Category-Weighted</option>
          </select>
          <button onClick={addClass}>Add Class</button>
        </div>
        <div>
          <h2>Your Classes</h2>
          <div className="tabs">
            {classes.map((cls, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <button
                  className={index === activeClassIndex ? "active" : ""}
                  onClick={() => switchClass(index)}
                >
                  {cls.name}
                </button>
                <button onClick={() => editClassName(index)}>Edit</button>
                <button onClick={() => deleteClass(index)}>Delete</button>
              </div>
            ))}
          </div>
          {classes.length > 0 && (
            <div>
              <h3>Active Class: {classes[activeClassIndex].name}</h3>
              <p>Type: {classes[activeClassIndex].type}</p>
              {classes[activeClassIndex].type === "point-based" && (
                <PointBasedClass
                  classData={classes[activeClassIndex]}
                  updateClassData={updateClassData}
                  gradeScale={gradeScale}
                />
              )}
              {classes[activeClassIndex].type === "category-weighted" && (
                <CategoryWeightedClass
                  classData={classes[activeClassIndex]}
                  updateClassData={updateClassData}
                />
              )}
            </div>
          )}
        </div>
        <div>
          <h2>Backup and Restore</h2>
          <button onClick={exportData}>Export Data</button>
          <input type="file" accept="application/json" onChange={importData} />
        </div>
        <div>
          <GradeScale gradeScale={gradeScale} setGradeScale={setGradeScale} />
        </div>
      </main>
    </div>
  );
}
