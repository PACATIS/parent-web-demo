const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export function loadApiConfig() {
  return { baseUrl: BASE_URL };
}

export function toApiPayload(crisis) {
  const { id, timestamp, context, antecedents, severity, duration, resolution, interventions, notes, needsDetails } = crisis;
  return {
    context,
    antecedents,
    severity,
    duration,
    resolution,
    interventions,
    notes: notes || "",
    needsDetails,
    timestamp,
  };
}

export async function createEpisode(apiConfig, payload) {
  const response = await fetch(`${apiConfig.baseUrl}/episodes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to create episode: ${response.status}`);
  }
  const created = await response.json();
  return {
    ...created,
    id: created.id || "c" + Date.now(),
    timestamp: created.timestamp || new Date().toISOString(),
    context: created.context || "Unknown",
    antecedents: created.antecedents || [],
    severity: created.severity || "moderate",
    duration: created.duration || 0,
    resolution: created.resolution || "unresolved",
    interventions: created.interventions || [],
    notes: created.notes || "",
    needsDetails: created.needsDetails ?? true,
  };
}
