import React, { useState, useEffect } from "react";
import PointBasedClass from "./components/PointBasedClass";
import CategoryWeightedClass from "./components/CategoryWeightedClass";
import GradeScale from "./components/GradeScale";

function App() {
  const [theme, setTheme] = useState("light");
  const [classes, setClasses] = useState(() => {
    const savedClasses = localStorage.getItem("classes");
    return savedClasses ? JSON.parse(savedClasses) : [];
  });
  const [newClassName, setNewClassName] = useState("");
  const [newClassType, setNewClassType] = useState("point-based");
  const [activeClassIndex, setActiveClassIndex] = useState(0);
  const [gradeScale, setGradeScale] = useState({
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

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const addClass = () => {
    if (newClassName.trim() === "") return;
    setClasses([
      ...classes,
      { name: newClassName, type: newClassType, data: [], categories: [] },
    ]);
    setNewClassName("");
  };

  const switchClass = (index) => {
    setActiveClassIndex(index);
  };

  const updateClassData = (data) => {
    const updatedClasses = classes.map((cls, index) =>
      index === activeClassIndex ? { ...cls, ...data } : cls
    );
    setClasses(updatedClasses);
  };

  const editClassName = (index) => {
    const newName = prompt("Enter new class name:", classes[index].name);
    if (newName) {
      const updatedClasses = classes.map((cls, i) =>
        i === index ? { ...cls, name: newName } : cls
      );
      setClasses(updatedClasses);
    }
  };

  const deleteClass = (index) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      const updatedClasses = classes.filter((_, i) => i !== index);
      setClasses(updatedClasses);
      if (activeClassIndex === index) {
        setActiveClassIndex(0);
      }
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(classes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "grade_calculator_data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedClasses = JSON.parse(e.target.result);
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
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Theme
      </button>
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
            onChange={(e) => setNewClassType(e.target.value)}
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

export default App;
