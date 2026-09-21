// PACATIS API client for the demo web app.
//
// Defaults match the local demo backend (apps/api on :3000) with the seeded
// demo caregiver. To point the app elsewhere, store a JSON override in
// localStorage under "pacatis-api-config", e.g.:
//   {"baseUrl":"https://api.example.com","email":"carer@example.com",
//    "password":"...","careRecipientId":"<uuid>"}
// No UI exposes these fields: the demo record keeps a single hard-coded
// caregiver and recipient (Lea Moreau).

export const API_DEFAULTS = {
  baseUrl: "http://localhost:3000",
  email: "claire@example.com",
  password: "secret123",
  careRecipientId: "11111111-1111-4111-8111-111111111111",
};

export function loadApiConfig(overrides = {}) {
  let saved = {};
  if (typeof localStorage !== "undefined") {
    try {
      saved = JSON.parse(localStorage.getItem("pacatis-api-config") || "{}");
    } catch {}
  }
  return { ...API_DEFAULTS, ...saved, ...overrides };
}

const resolutionToOutcome = {
  worked: "worked",
  dissipated: "partiallyWorked",
  unresolved: "didNotWork",
};

// Maps a frontend crisis record onto the POST /v1/care-recipients/:id/episodes
// request. Quick captures stay minimal (severity + timestamp + context) so an
// episode can be saved in a few seconds; nothing is made mandatory by the API.
export function toApiPayload(crisis) {
  const hasDetails =
    crisis.duration != null &&
    crisis.duration > 0 &&
    crisis.resolution &&
    (crisis.interventions ?? []).length > 0;

  const payload = {
    severity: crisis.severity || "moderate",
    timestamp: crisis.timestamp || new Date().toISOString(),
    context: crisis.context || "Unknown",
  };

  if ((crisis.antecedents ?? []).length > 0) {
    payload.antecedents = crisis.antecedents;
  }

  if (hasDetails) {
    payload.duration = Math.round(crisis.duration);
    payload.outcome = resolutionToOutcome[crisis.resolution];
    payload.interventions = crisis.interventions.map((i) => ({
      title: i.title,
      outcome: i.outcome,
      minutes: Number(i.minutes) || undefined,
    }));
  }

  return payload;
}

// Normalizes the API response (camelCase) into the shape the UI expects.
export function toCrisis(episode) {
  return {
    id: episode.id,
    timestamp: episode.timestamp,
    context: episode.context,
    antecedents: episode.antecedents ?? [],
    severity: episode.severity,
    duration: episode.duration ?? 0,
    resolution: episode.resolution,
    interventions: (episode.interventions ?? []).map((i) => ({
      title: i.title,
      outcome: i.outcome,
      minutes: i.minutes ?? 0,
      order: i.order ?? 0,
    })),
    notes: episode.notes ?? "",
    needsDetails: episode.needsDetails,
  };
}

export async function createEpisode(config, payload) {
  const base = String(config.baseUrl || "").replace(/\/+$/, "");
  const url = `${base}/v1/care-recipients/${config.careRecipientId}/episodes`;

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${config.email}:${config.password}`),
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Cannot reach the PACATIS API. Is the backend running?");
  }

  if (!res.ok) {
    let message = `Could not save the episode (HTTP ${res.status}).`;
    try {
      const body = await res.json();
      if (body?.error?.message) message = body.error.message;
    } catch {}
    throw new Error(message);
  }

  return toCrisis(await res.json());
}