const calculateZScore = (result, mean, sd) => {
  return (result - mean) / sd;
};

const checkWestgardRules = (zScore, prevZScores = []) => {
  const violations = [];
  const all = [zScore, ...prevZScores];

  if (Math.abs(zScore) > 2) {
    violations.push({
      rule: "1_2S",
      severity: "warning",
      message: "Result is beyond 2 SD - warning",
    });
  }

  if (Math.abs(zScore) > 3) {
    violations.push({
      rule: "1_3S",
      severity: "reject",
      message: "Result is beyond 3 SD - rejected",
    });
  }

  if (prevZScores.length >= 1) {
    const prev = prevZScores[0];
    const bothAbove = zScore > 2 && prev > 2;
    const bothBelow = zScore < -2 && prev < -2;
    if (bothAbove || bothBelow) {
      violations.push({
        rule: "2_2S",
        severity: "reject",
        message: "Two consecutive results beyond 2 SD same side - rejected",
      });
    }
  }

  if (prevZScores.length >= 1) {
    const range = Math.abs(zScore - prevZScores[0]);
    if (range > 4) {
      violations.push({
        rule: "R_4S",
        severity: "reject",
        message: "Range between last two results exceeds 4 SD - rejected",
      });
    }
  }

  if (all.length >= 4) {
    const last4 = all.slice(0, 4);
    const allAbove = last4.every((z) => z > 1);
    const allBelow = last4.every((z) => z < -1);
    if (allAbove || allBelow) {
      violations.push({
        rule: "4_1S",
        severity: "reject",
        message: "Four consecutive results beyond 1 SD same side - rejected",
      });
    }
  }

  return violations;
};

const determineStatus = (violations) => {
  if (violations.some((v) => v.severity === "reject")) return "rejected";
  if (violations.some((v) => v.severity === "warning")) return "warning";
  return "in_control";
};

module.exports = { calculateZScore, checkWestgardRules, determineStatus };
