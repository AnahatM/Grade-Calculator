import { useState } from "react";
import { Category } from "../hooks/useClasses";

// Define types for props
type PredictCategoryNextGradeProps = {
  categories: Category[];
  categoryScores: Record<string, { score: number; total: number }>;
  gradeScale: Record<string, number>;
};

export default function PredictCategoryNextGrade({
  categories,
  categoryScores,
  gradeScale,
}: PredictCategoryNextGradeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories.length > 0 ? categories[0].name : ""
  );
  const [nextTotal, setNextTotal] = useState<string>("");
  const [desiredGrade, setDesiredGrade] = useState<string>("");
  const [predictedPoints, setPredictedPoints] = useState<string>("");

  // Calculate the current overall grade
  const calculateCurrentGrade = (): number => {
    const totalWeightedScore = categories.reduce((sum, category) => {
      const { score, total } = categoryScores[category.name] || {
        score: 0,
        total: 0,
      };
      const weight = category.weight / 100;
      const weightedScore = total > 0 ? (score / total) * weight : 0;
      return sum + weightedScore;
    }, 0);

    return totalWeightedScore * 100;
  };

  // Calculate the score needed to achieve the desired grade
  const calculateNeededScore = (): number | null => {
    if (!nextTotal || !desiredGrade || !selectedCategory) return null;

    const desiredPercentage = gradeScale[desiredGrade] / 100;
    const categoryWeight =
      categories.find((cat) => cat.name === selectedCategory)?.weight || 0;
    const weightFactor = categoryWeight / 100;

    // Calculate current weighted total across all categories
    const currentWeightedTotal = calculateCurrentGrade() / 100;

    // Get current values for the selected category
    const currentCategoryData = categoryScores[selectedCategory] || {
      score: 0,
      total: 0,
    };
    const { score: currentScore, total: currentTotal } = currentCategoryData;

    // Calculate what the category needs to contribute to reach desired grade
    const targetWeightedContribution =
      desiredPercentage -
      (currentWeightedTotal -
        (currentTotal > 0 ? (currentScore / currentTotal) * weightFactor : 0));

    // Calculate what score is needed for the new assignment
    const newTotal = currentTotal + Number(nextTotal);
    const neededScore =
      (targetWeightedContribution / weightFactor) * newTotal - currentScore;

    return Math.max(0, parseFloat(neededScore.toFixed(2)));
  };

  // Calculate the predicted grade based on entered points
  const calculatePredictedGrade = (): {
    predictedGrade: string;
    newPercentage: number;
  } | null => {
    if (!predictedPoints || !nextTotal || !selectedCategory) return null;

    // Create a copy of category scores
    const newCategoryScores = { ...categoryScores };
    const categoryData = newCategoryScores[selectedCategory] || {
      score: 0,
      total: 0,
    };

    // Update with predicted score
    newCategoryScores[selectedCategory] = {
      score: categoryData.score + Number(predictedPoints),
      total: categoryData.total + Number(nextTotal),
    };

    // Calculate new overall grade
    const totalWeightedScore = categories.reduce((sum, category) => {
      const { score, total } = newCategoryScores[category.name] || {
        score: 0,
        total: 0,
      };
      const weight = category.weight / 100;
      const weightedScore = total > 0 ? (score / total) * weight : 0;
      return sum + weightedScore;
    }, 0);

    const newPercentage = totalWeightedScore * 100;

    const predictedGrade =
      Object.entries(gradeScale).find(
        ([, minPercentage]) => newPercentage >= minPercentage
      )?.[0] || "F";

    return { predictedGrade, newPercentage };
  };

  const neededScore = calculateNeededScore();
  const result = calculatePredictedGrade();
  const { predictedGrade, newPercentage } = result || {};

  return (
    <div
      className="predict-next-grade neuromorphic accent-border"
      style={{ marginBottom: "20px" }}
    >
      <h2>Predict Your Next Grade</h2>

      {/* Category Selector */}
      <div>
        <label>
          Suppose my next assignment is the category:
          <select
            className="neuromorphic"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name} ({cat.weight}%)
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Total Points */}
      <div className="total-points">
        <label>
          Total Points for Next Assignment:
          <input
            className="neuromorphic-inset"
            type="number"
            value={nextTotal}
            onChange={(e) => setNextTotal(e.target.value)}
            placeholder="e.g. 100"
          />
        </label>
      </div>

      {/* Predicted Points */}
      <div>
        <label>
          If I score:
          <input
            className="neuromorphic-inset"
            type="number"
            value={predictedPoints}
            onChange={(e) => setPredictedPoints(e.target.value)}
            placeholder="e.g. 85"
          />
          points, my grade will be:{" "}
          <span className="neuromorphic-inset">{predictedGrade || "_"}</span>
        </label>
        {predictedGrade && (
          <p>
            Your overall percentage grade will be {newPercentage?.toFixed(2)}%.
          </p>
        )}
      </div>

      {/* Calculate Desired Grade */}
      <div>
        <div>
          <label>
            I want to get a grade of:
            <select
              className="neuromorphic"
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
            To achieve a {desiredGrade}, you need to score at least{" "}
            {neededScore} points on your next assignment in the{" "}
            {selectedCategory} category, or{" "}
            {((neededScore / Number(nextTotal)) * 100).toFixed(2)}%
          </p>
        )}
      </div>
    </div>
  );
}
