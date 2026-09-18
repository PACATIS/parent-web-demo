import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  X,
  Zap,
} from "lucide-react";

const contexts = [
  "Home",
  "School",
  "Transition",
  "Meal",
  "Outside",
  "Bedtime",
  "Unknown",
];

const triggers = [
  "Noise",
  "Touch",
  "Change",
  "Demand",
  "Waiting",
  "Fatigue",
  "Crowded space",
  "Hunger",
  "Unknown",
];

const measures = [
  "Headset",
  "Offered fidget",
  "Fidget offered at first cue",
  "Visual timer 10 minutes before",
  "Moved to a quiet room",
  "Art utensils in the quiet room",
  "Placed in room alone",
];

export default function LogModal({ onClose, onQuickSave, onSave }) {
  const [step, setStep] = useState(1);
  const [sev, setSev] = useState("");
  const [context, setContext] = useState("");
  const [ants, setAnts] = useState([]);
  const [duration, setDuration] = useState(15);
  const [measure, setMeasure] = useState(measures[0]);
  const [outcome, setOutcome] = useState("worked");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const buildCrisis = ({ complete = false, includeDetails = false } = {}) => ({
    id: "c" + Date.now(),
    timestamp: new Date().toISOString(),
    context: context || "Unknown",
    antecedents: includeDetails ? ants : [],
    severity: sev || "moderate",
    duration: includeDetails ? Number(duration) : 0,
    resolution: includeDetails
      ? outcome === "worked"
        ? "worked"
        : outcome === "partiallyWorked"
          ? "dissipated"
          : "unresolved"
      : "unresolved",
    interventions: includeDetails
      ? [
          {
            title: measure,
            outcome,
            minutes: outcome === "worked" ? 5 : 0,
            order: 0,
          },
        ]
      : [],
    notes: "",
    needsDetails: !complete,
  });

  const save = async (
    target,
    { complete = false, includeDetails = false } = {},
  ) => {
    setSaving(true);
    setError(null);
    try {
      await target(buildCrisis({ complete, includeDetails }));
      setSaved(true);
    } catch (err) {
      setError(err?.message || "Could not save the episode. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="overlay">
        <div className="modal quicksaved">
          <div className="successicon">
            <CheckCircle2 size={28} />
          </div>
          <div className="eyebrow">EPISODE SAVED</div>
          <h2>You're done.</h2>
          <p className="muted">
            The episode is safely on the record. You can add details later.
          </p>
          <button className="primary full" onClick={onClose}>
            Back to today
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay">
      <div className="modal logmodal">
        <div className="modalhead">
          <div>
            <span className="eyebrow">
              LOG EPISODE · {step === 1 ? "QUICK" : "DETAILS"}
            </span>
            <h2>{step === 1 ? "What happened?" : "Add a little more"}</h2>
          </div>
          <button className="iconbtn" onClick={onClose}>
            <X />
          </button>
        </div>

        {step === 1 && (
          <div>
            <p className="muted loghint">
              Start with the two things PACATIS needs most. Everything else can
              wait.
            </p>

            <div className="logsection">
              <div className="loglabel">
                <Zap size={16} /> Intensity
              </div>
              <div className="severitygrid compact">
                {["mild", "moderate", "severe"].map((x) => (
                  <button
                    key={x}
                    className={sev === x ? "selected" : ""}
                    onClick={() => setSev(x)}
                  >
                    <b>
                      {x === "mild" ? "+" : x === "moderate" ? "++" : "+++"}
                    </b>
                    <span>{x}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="logsection">
              <div className="loglabel">
                <Clock3 size={16} /> What was happening?
              </div>
              <div className="choicegrid compact">
                {contexts.map((x) => (
                  <button
                    key={x}
                    className={context === x ? "selected" : ""}
                    onClick={() => setContext(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>

            <div className="logactions">
              <button
                className="secondary"
                onClick={() => save(onQuickSave, { complete: false })}
                disabled={!sev || saving}
              >
                Save now
              </button>
              <button
                className="primary"
                onClick={() => setStep(2)}
                disabled={!sev}
              >
                Add details <ChevronRight size={17} />
              </button>
            </div>
            {error && (
              <div className="saveerror">
                <AlertTriangle size={16} /> <span>{error}</span>
              </div>
            )}
            <p className="microcopy">
              No typing. “Save now” captures the moment in a few seconds.
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="detailbar">
              <button className="textbtn" onClick={() => setStep(1)}>
                ← Back
              </button>
              <span>Optional · about 20–30 seconds</span>
            </div>

            <div className="logsection">
              <div className="loglabel">What came before?</div>
              <div className="choicegrid compact">
                {triggers.map((x) => (
                  <button
                    key={x}
                    className={ants.includes(x) ? "selected" : ""}
                    onClick={() =>
                      setAnts((a) =>
                        a.includes(x) ? a.filter((y) => y !== x) : [...a, x],
                      )
                    }
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>

            <div className="logsection">
              <div className="loglabel">Approximate duration</div>
              <div className="durationgrid">
                {[5, 15, 30, 60, 90].map((minutes) => (
                  <button
                    key={minutes}
                    className={Number(duration) === minutes ? "selected" : ""}
                    onClick={() => setDuration(minutes)}
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
            </div>

            <div className="logsection">
              <label>
                What did you try?
                <select
                  value={measure}
                  onChange={(e) => setMeasure(e.target.value)}
                >
                  {measures.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <div className="outcomes">
                {[
                  ["worked", "Worked"],
                  ["partiallyWorked", "A little"],
                  ["didNotWork", "Didn't work"],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    className={outcome === v ? "selected" : ""}
                    onClick={() => setOutcome(v)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="logactions">
              <button
                className="secondary"
                onClick={() =>
                  save(onSave, { complete: false, includeDetails: true })
                }
                disabled={saving}
              >
                Save & finish later
              </button>
              <button
                className="primary"
                onClick={() =>
                  save(onSave, { complete: true, includeDetails: true })
                }
                disabled={saving}
              >
                Save episode <CheckCircle2 size={17} />
              </button>
            </div>
            {error && (
              <div className="saveerror">
                <AlertTriangle size={16} /> <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
