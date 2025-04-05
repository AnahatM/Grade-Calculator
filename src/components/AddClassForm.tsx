import { useState } from "react";

type AddClassFormProps = {
  addClass: (name: string, type: "point-based" | "category-weighted") => void;
};

export default function AddClassForm({ addClass }: AddClassFormProps) {
  const [newClassName, setNewClassName] = useState<string>("");
  const [newClassType, setNewClassType] = useState<
    "point-based" | "category-weighted"
  >("point-based");

  const handleAddClass = () => {
    if (newClassName.trim() === "") return;
    addClass(newClassName, newClassType);
    setNewClassName("");
  };

  return (
    <div className="add-class-form neuromorphic accent-border">
      <h2>Add a New Class</h2>
      <input
        type="text"
        placeholder="Class Name"
        value={newClassName}
        onChange={(e) => setNewClassName(e.target.value)}
        className="neuromorphic-inset"
      />
      <select
        value={newClassType}
        onChange={(e) =>
          setNewClassType(e.target.value as "point-based" | "category-weighted")
        }
        className="neuromorphic"
      >
        <option value="point-based">Point-Based</option>
        <option value="category-weighted">Category-Weighted</option>
      </select>
      <button onClick={handleAddClass} className="neuromorphic">
        Add Class
      </button>
    </div>
  );
}
