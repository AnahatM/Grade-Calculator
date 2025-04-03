import { useClasses } from "./hooks/useClasses.ts";
import AddClassForm from "./components/AddClassForm.tsx";
import ClassTabs from "./components/ClassTabs.tsx";
import BackupRestore from "./components/BackupRestore.tsx";
import PointBasedClass from "./components/PointBasedClass.tsx";
import CategoryWeightedClass from "./components/CategoryWeightedClass";
import GradeScale from "./components/GradeScale";

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

  const gradeScale = {
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
          <BackupRestore setClasses={setClasses} />
          <GradeScale gradeScale={gradeScale} setGradeScale={() => {}} />
        </main>
      </div>
    </>
  );
}
