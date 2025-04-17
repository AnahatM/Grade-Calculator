import { useState, useEffect } from "react";

type TermFinalGradeCalculatorProps = {
  gradeScale: Record<string, number>;
};

export default function TermFinalGradeCalculator({
  gradeScale,
}: TermFinalGradeCalculatorProps) {
  // State for user inputs
  const [desiredGrade, setDesiredGrade] = useState<string>("");
  const [desiredPercentage, setDesiredPercentage] = useState<string>("");
  const [finalExamScore, setFinalExamScore] = useState<string>("");
  const [term1Grade, setTerm1Grade] = useState<string>("");
  const [calculationResult, setCalculationResult] = useState<string | null>(
    null
  );

  // New state for editable weights
  const [term1Weight, setTerm1Weight] = useState<string>("45");
  const [term2Weight, setTerm2Weight] = useState<string>("45");
  const [finalExamWeight, setFinalExamWeight] = useState<string>("10");
  const [weightsValid, setWeightsValid] = useState<boolean>(true);

  // Effect to convert letter grade to percentage
  useEffect(() => {
    if (desiredGrade && desiredGrade !== "custom") {
      const percentage = gradeScale[desiredGrade];
      if (percentage !== undefined) {
        setDesiredPercentage(percentage.toString());
      }
    }
  }, [desiredGrade, gradeScale]);

  // Effect to validate that weights sum to 100%
  useEffect(() => {
    const t1 = parseFloat(term1Weight) || 0;
    const t2 = parseFloat(term2Weight) || 0;
    const fe = parseFloat(finalExamWeight) || 0;

    // Check if weights sum to approximately 100% (allow for small floating-point errors)
    setWeightsValid(Math.abs(t1 + t2 + fe - 100) < 0.01);
  }, [term1Weight, term2Weight, finalExamWeight]);

  // Calculate the term 2 grade needed - now runs whenever inputs change
  useEffect(() => {
    if (!desiredPercentage || !finalExamScore || !term1Grade || !weightsValid) {
      setCalculationResult(null);
      return;
    }

    const desiredGradeValue = parseFloat(desiredPercentage);
    const finalScore = parseFloat(finalExamScore);
    const term1 = parseFloat(term1Grade);

    // Get weights as decimals
    const t1Weight = parseFloat(term1Weight) / 100;
    const t2Weight = parseFloat(term2Weight) / 100;
    const feWeight = parseFloat(finalExamWeight) / 100;

    // Formula using user-defined weights:
    // (Desired Grade - (Final Exam Score * feWeight) - (Term 1 Grade * t1Weight)) / t2Weight
    const neededTermGrade =
      (desiredGradeValue - finalScore * feWeight - term1 * t1Weight) / t2Weight;

    setCalculationResult(neededTermGrade.toFixed(2));
  }, [
    desiredPercentage,
    finalExamScore,
    term1Grade,
    term1Weight,
    term2Weight,
    finalExamWeight,
    weightsValid,
  ]);

  // Find corresponding letter grade for a percentage
  const getLetterGrade = (percentage: number): string => {
    return (
      Object.entries(gradeScale).find(
        ([, minPercentage]) => percentage >= minPercentage
      )?.[0] || "F"
    );
  };

  // Handle weight input changes with validation
  const handleWeightChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    // Ensure the value is a valid number between 0 and 100
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
      setter(value);
    } else if (value === "") {
      setter("0");
    }
  };

  return (
    <div
      className="predict-next-grade neuromorphic accent-border"
      style={{ marginBottom: "40px" }}
    >
      <h2>Term/Final Grade Calculator</h2>
      <p>
        Calculate what you need on Term 2 to achieve your desired final grade.
      </p>

      {/* Weight settings section */}
      <div
        className="neuromorphic"
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: weightsValid
            ? "transparent"
            : "var(--warning-color)",
          color: weightsValid
            ? "var(--text-color)"
            : "var(--inverse-primary-color)",
        }}
      >
        <p style={{ marginBottom: "10px" }}>
          <strong>Grade Weights:</strong> Customize the weight of each component
          (must total 100%)
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ marginRight: "5px" }}>Term 1:</label>
            <input
              className="neuromorphic-inset"
              type="number"
              value={term1Weight}
              onChange={(e) =>
                handleWeightChange(e.target.value, setTerm1Weight)
              }
              style={{
                width: "60px",
                padding: "5px 10px",
                textAlign: "center",
              }}
            />
            <span style={{ marginLeft: "2px" }}>%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ marginRight: "5px" }}>Term 2:</label>
            <input
              className="neuromorphic-inset"
              type="number"
              value={term2Weight}
              onChange={(e) =>
                handleWeightChange(e.target.value, setTerm2Weight)
              }
              style={{
                width: "60px",
                padding: "5px 10px",
                textAlign: "center",
              }}
            />
            <span style={{ marginLeft: "2px" }}>%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ marginRight: "5px" }}>Final Exam:</label>
            <input
              className="neuromorphic-inset"
              type="number"
              value={finalExamWeight}
              onChange={(e) =>
                handleWeightChange(e.target.value, setFinalExamWeight)
              }
              style={{
                width: "60px",
                padding: "5px 10px",
                textAlign: "center",
              }}
            />
            <span style={{ marginLeft: "2px" }}>%</span>
          </div>
          <div style={{ marginLeft: "10px" }}>
            Total:{" "}
            {(
              parseFloat(term1Weight) +
              parseFloat(term2Weight) +
              parseFloat(finalExamWeight)
            ).toFixed(1)}
            %
            {!weightsValid && (
              <span
                style={{ color: "var(--negative-color)", fontWeight: "bold" }}
              >
                {" "}
                (Must equal 100%)
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Desired Final Grade:{" "}
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              className="neuromorphic"
              value={desiredGrade}
              onChange={(e) => {
                setDesiredGrade(e.target.value);
                if (e.target.value === "custom") {
                  setDesiredPercentage("");
                }
              }}
              style={{ padding: "10px 20px" }}
            >
              <option value="">Select Grade</option>
              {Object.keys(gradeScale).map((grade) => (
                <option key={grade} value={grade}>
                  {grade} ({gradeScale[grade]}%)
                </option>
              ))}
              <option value="custom">Custom Percentage</option>
            </select>

            {desiredGrade === "custom" && (
              <input
                className="neuromorphic-inset"
                type="number"
                value={desiredPercentage}
                onChange={(e) => setDesiredPercentage(e.target.value)}
                placeholder="e.g. 89.5"
                style={{ width: "120px", padding: "10px 20px" }}
              />
            )}
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Expected Final Exam Score (%):
          </label>
          <input
            className="neuromorphic-inset"
            type="number"
            value={finalExamScore}
            onChange={(e) => setFinalExamScore(e.target.value)}
            placeholder="e.g. 90"
            style={{ padding: "10px 20px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Term 1 Grade (%):
          </label>
          <input
            className="neuromorphic-inset"
            type="number"
            value={term1Grade}
            onChange={(e) => setTerm1Grade(e.target.value)}
            placeholder="e.g. 85"
            style={{ padding: "10px 20px" }}
          />
        </div>
      </div>

      {calculationResult !== null && weightsValid && (
        <div
          className="neuromorphic"
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor:
              parseFloat(calculationResult) > 100
                ? "var(--negative-color)"
                : parseFloat(calculationResult) < 0
                ? "var(--warning-color)"
                : "var(--positive-color)",
            color: "var(--inverse-primary-color)",
          }}
        >
          <p>
            You need to score <strong>{calculationResult}%</strong> on Term 2 to
            achieve a final grade of {desiredPercentage}% (
            {desiredGrade !== "custom"
              ? desiredGrade
              : getLetterGrade(parseFloat(desiredPercentage))}
            ).
          </p>
          {parseFloat(calculationResult) > 100 && (
            <p style={{ marginTop: "10px" }}>
              Note: This score is not achievable. Consider adjusting your
              desired final grade or improving your final exam score.
            </p>
          )}
          {parseFloat(calculationResult) <= 0 && (
            <p style={{ marginTop: "10px" }}>
              Good news! Even with 0% on Term 2, you can still achieve your
              desired final grade.
            </p>
          )}
        </div>
      )}

      <div
        className="neuromorphic"
        style={{ marginTop: "20px", padding: "15px" }}
      >
        <p>
          <strong>Formula:</strong> (Desired Grade - (Final Exam ×{" "}
          {parseFloat(finalExamWeight) / 100}) - (Term 1 ×{" "}
          {parseFloat(term1Weight) / 100})) ÷ {parseFloat(term2Weight) / 100}
        </p>
      </div>
    </div>
  );
}
