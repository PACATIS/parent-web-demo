export function measureStats(crises) {
  const map = {};
  crises
    .flatMap((c) => c.interventions)
    .forEach((i) => {
      map[i.title] ??= { title: i.title, attempts: 0, score: 0 };
      map[i.title].attempts++;
      map[i.title].score +=
        i.outcome === "worked" ? 1 : i.outcome === "partiallyWorked" ? 0.5 : 0;
    });
  return Object.values(map)
    .map((x) => ({ ...x, rate: x.score / x.attempts }))
    .sort((a, b) => b.rate - a.rate || b.attempts - a.attempts);
}
