type ClassTabsProps = {
  classes: { name: string }[];
  activeClassIndex: number;
  switchClass: (index: number) => void;
  editClassName: (index: number) => void;
  deleteClass: (index: number) => void;
};

export default function ClassTabs({
  classes,
  activeClassIndex,
  switchClass,
  editClassName,
  deleteClass,
}: ClassTabsProps) {
  return (
    <div className="class-tabs neuromorphic">
      <h2>Your Classes</h2>
      <div>
        {classes.map((cls, index) => (
          <div
            className="neuromorphic"
            key={index}
            style={{ display: "flex", alignItems: "center" }}
          >
            <button
              className={`neuromorphic ${
                index === activeClassIndex ? "active" : ""
              }`}
              onClick={() => switchClass(index)}
            >
              {cls.name}
            </button>
            <span>
              <button onClick={() => editClassName(index)}>Edit</button>
              <button onClick={() => deleteClass(index)}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
