import { useClasses } from "./hooks/useClasses.ts";
import AddClassForm from "./components/AddClassForm.tsx";
import ClassTabs from "./components/ClassTabs.tsx";
import BackupRestore from "./components/BackupRestore.tsx";
import PointBasedClass from "./components/PointBasedClass.tsx";
import CategoryWeightedClass from "./components/CategoryWeightedClass";
import GradeScale from "./components/GradeScale";
import PredictNextGrade from "./components/PredictNextGrade.tsx";
import { PointBasedAssignment } from "./hooks/useClasses";
import { useState, useEffect } from "react";

import "./App.css";
import Header from "./components/Header.tsx";

export default function App() {
  const {
    classes,
    activeClassIndex,
    addClass,
    switchClass,
    updateClassData,
    editClassName,
    deleteClass,
    setClasses,
  } = useClasses();

  const defaultGradeScale = {
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
  };

  // State to keep track of the grade scale
  const [gradeScale, setGradeScale] = useState<Record<string, number>>(() => {
    const savedScale = localStorage.getItem("gradeScale");
    return savedScale ? JSON.parse(savedScale) : defaultGradeScale;
  });

  // Save grade scale to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gradeScale", JSON.stringify(gradeScale));
  }, [gradeScale]);

  const { totalScore, totalMax } =
    classes.length > 0 && classes[activeClassIndex].type === "point-based"
      ? (classes[activeClassIndex].data as PointBasedAssignment[]).reduce(
          (totals, row) => ({
            totalScore: totals.totalScore + Number(row.score || 0),
            totalMax: totals.totalMax + Number(row.total || 0),
          }),
          { totalScore: 0, totalMax: 0 }
        )
      : { totalScore: 0, totalMax: 0 };

  return (
    <>
      <Header />
      <div className="app">
        <main>
          <AddClassForm addClass={addClass} />
          <ClassTabs
            classes={classes}
            activeClassIndex={activeClassIndex}
            switchClass={switchClass}
            editClassName={editClassName}
            deleteClass={deleteClass}
          />
          {classes.length > 0 && (
            <div>
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
                  gradeScale={gradeScale}
                />
              )}
            </div>
          )}
          {classes.length > 0 &&
            classes[activeClassIndex].type === "point-based" && (
              <PredictNextGrade
                totalScore={totalScore}
                totalMax={totalMax}
                gradeScale={gradeScale}
              />
            )}
          <BackupRestore setClasses={setClasses} />
          <GradeScale gradeScale={gradeScale} setGradeScale={setGradeScale} />
          <div style={{ height: "200px" }}></div>
        </main>
      </div>
    </>
  );
}
