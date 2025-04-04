import { useState, useEffect } from "react";

type ClassData = {
  name: string;
  type: "point-based" | "category-weighted";
  data: any[];
  categories: any[];
};

export function useClasses() {
  const [classes, setClasses] = useState<ClassData[]>(() => {
    const savedClasses = localStorage.getItem("classes");
    return savedClasses ? (JSON.parse(savedClasses) as ClassData[]) : [];
  });
  const [activeClassIndex, setActiveClassIndex] = useState<number>(0);
  const [activeClassData, setActiveClassData] = useState<ClassData | null>(
    classes[0] || null
  );

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    setActiveClassData(classes[activeClassIndex] || null);
  }, [activeClassIndex, classes]);

  const addClass = (
    name: string,
    type: "point-based" | "category-weighted"
  ) => {
    setClasses([...classes, { name, type, data: [], categories: [] }]);
  };

  const switchClass = (index: number) => setActiveClassIndex(index);

  const updateClassData = (data: Partial<ClassData>) => {
    setClasses((prevClasses) =>
      prevClasses.map((cls, index) =>
        index === activeClassIndex ? { ...cls, ...data } : cls
      )
    );
  };

  const editClassName = (index: number) => {
    const newName = prompt("Enter new class name:", classes[index].name);
    if (newName) {
      setClasses((prevClasses) =>
        prevClasses.map((cls, i) =>
          i === index ? { ...cls, name: newName } : cls
        )
      );
    }
  };

  const deleteClass = (index: number) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setClasses((prevClasses) => prevClasses.filter((_, i) => i !== index));
      if (activeClassIndex === index) setActiveClassIndex(0);
    }
  };

  return {
    classes,
    activeClassIndex,
    activeClassData,
    addClass,
    switchClass,
    updateClassData,
    editClassName,
    deleteClass,
    setClasses,
  };
}
