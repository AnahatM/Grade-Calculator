import React, { useState } from "react";

function PredictNextGrade({ totalScore, totalMax, gradeScale }) {
  const [nextTotal, setNextTotal] = useState("");
  const [desiredGrade, setDesiredGrade] = useState("");
  const [predictedPoints, setPredictedPoints] = useState("");

  const calculateNeededScore = () => {
    if (!nextTotal || !desiredGrade) return null;
    const desiredPercentage = gradeScale[desiredGrade];
    if (desiredPercentage === undefined) return null;

    const neededScore =
      (desiredPercentage / 100) * (totalMax + Number(nextTotal)) - totalScore;
    return Math.max(0, neededScore.toFixed(2));
  };

  const calculatePredictedGrade = () => {
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
            and your percentage grade will be {newPercentage.toFixed(2)}%.
          </p>
        )}
      </div>
      <div>
        <p>
          Current Overall Percentage:{" "}
          {((totalScore / totalMax) * 100).toFixed(2)}% (
          {Object.entries(gradeScale).find(
            ([, minPercentage]) =>
              (totalScore / totalMax) * 100 >= minPercentage
          )?.[0] || "F"}
          )
        </p>
      </div>
    </div>
  );
}

export default PredictNextGrade;
