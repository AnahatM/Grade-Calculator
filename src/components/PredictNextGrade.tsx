import { useState } from "react";

// Define types for props
type PredictNextGradeProps = {
  totalScore: number;
  totalMax: number;
  gradeScale: Record<string, number>;
};

export default function PredictNextGrade({
  totalScore,
  totalMax,
  gradeScale,
}: PredictNextGradeProps) {
  const [nextTotal, setNextTotal] = useState<string>("");
  const [desiredGrade, setDesiredGrade] = useState<string>("");
  const [predictedPoints, setPredictedPoints] = useState<string>("");

  // Calculate the score needed to achieve the desired grade
  const calculateNeededScore = (): number | null => {
    if (!nextTotal || !desiredGrade) return null;
    const desiredPercentage = gradeScale[desiredGrade];
    if (desiredPercentage === undefined) return null;

    const neededScore =
      (desiredPercentage / 100) * (totalMax + Number(nextTotal)) - totalScore;
    return Math.max(0, parseFloat(neededScore.toFixed(2)));
  };

  // Calculate the predicted grade based on entered points
  const calculatePredictedGrade = (): {
    predictedGrade: string;
    newTotalScore: number;
    newTotalMax: number;
    newPercentage: number;
  } | null => {
    if (!predictedPoints) return null;
    const newTotalScore = totalScore + Number(predictedPoints);
    const newTotalMax = totalMax + Number(nextTotal);
    const newPercentage = (newTotalScore / newTotalMax) * 100;

    const predictedGrade =
      Object.entries(gradeScale).find(
        ([, minPercentage]) => newPercentage >= minPercentage
      )?.[0] || "F";
    return { predictedGrade, newTotalScore, newTotalMax, newPercentage };
  };

  const neededScore = calculateNeededScore();
  const { predictedGrade, newTotalScore, newTotalMax, newPercentage } =
    calculatePredictedGrade() || {};

  return (
    <div>
      <h3>Predict Your Next Grade</h3>
      <div>
        <label>
          Total Points for Next Assignment:
          <input
            type="number"
            value={nextTotal}
            onChange={(e) => setNextTotal(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Desired Grade:
          <select
            value={desiredGrade}
            onChange={(e) => setDesiredGrade(e.target.value)}
          >
            <option value="">Select Grade</option>
            {Object.keys(gradeScale).map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </label>
      </div>
      {neededScore !== null && (
        <p>
          To achieve a {desiredGrade}, you need to score at least {neededScore}{" "}
          points on your next assignment.
        </p>
      )}
      <div>
        <label>
          If you score:
          <input
            type="number"
            value={predictedPoints}
            onChange={(e) => setPredictedPoints(e.target.value)}
          />
          points, your grade will be: {predictedGrade || "N/A"}
        </label>
        {predictedGrade && (
          <p>
            Your grade will be {newTotalScore} points / {newTotalMax} points,
            and your percentage grade will be {newPercentage?.toFixed(2)}%.
          </p>
        )}
      </div>
    </div>
  );
}
