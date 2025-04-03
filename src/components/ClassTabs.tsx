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
    <div>
      <h2>Your Classes</h2>
      <div className="tabs">
        {classes.map((cls, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
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
    </div>
  );
}
