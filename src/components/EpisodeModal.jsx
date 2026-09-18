import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, X, Zap } from "lucide-react";
import { fmtDateTime } from "../data/seed.js";
import { Stat } from "./shared.jsx";

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

export default function EpisodeModal({ crisis: c, onClose, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [ants, setAnts] = useState(c.antecedents ?? []);
  const [duration, setDuration] = useState(c.duration || 15);
  const [measure, setMeasure] = useState(
    c.interventions?.[0]?.title || measures[0],
  );
  const [outcome, setOutcome] = useState(
    c.interventions?.[0]?.outcome || "worked",
  );

  const complete = () => {
    onUpdate?.({
      ...c,
      antecedents: ants,
      duration: Number(duration),
      resolution:
        outcome === "worked"
          ? "worked"
          : outcome === "partiallyWorked"
            ? "dissipated"
            : "unresolved",
      interventions: [
        {
          title: measure,
          outcome,
          minutes: outcome === "worked" ? 5 : 0,
          order: 0,
        },
      ],
      needsDetails: false,
    });
    setEditing(false);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modalhead">
          <div>
            <span className="eyebrow">{fmtDateTime(c.timestamp)}</span>
            <h2>{c.context}</h2>
          </div>
          <button className="iconbtn" onClick={onClose}>
            <X />
          </button>
        </div>

        {c.needsDetails && !editing && (
          <div className="incompletecard">
            <div>
              <b>Quick capture saved</b>
              <p className="muted">
                You can add the details when things are calmer.
              </p>
            </div>
            <button className="primary" onClick={() => setEditing(true)}>
              Complete details
            </button>
          </div>
        )}

        {!editing ? (
          <>
            <div className="stats">
              <Stat
                value={c.needsDetails ? "—" : c.duration + "m"}
                label="Duration"
                icon={<Clock3 />}
              />
              <Stat value={c.severity} label="Intensity" icon={<Zap />} />
              <Stat
                value={c.antecedents?.length ?? 0}
                label="Antecedents"
                icon={<AlertTriangle />}
              />
            </div>
            <h3>What came before</h3>
            <div className="chips">
              {(c.antecedents ?? []).length ? (
                c.antecedents.map((x) => <span key={x}>{x}</span>)
              ) : (
                <span className="emptychip">Not captured</span>
              )}
            </div>
            <h3>What was tried</h3>
            {(c.interventions ?? []).length ? (
              c.interventions.map((i) => (
                <div className="timeline" key={i.title}>
                  <div className={"dot " + i.outcome}></div>
                  <div>
                    <b>{i.title}</b>
                    <span>
                      {i.outcome === "worked"
                        ? "Worked"
                        : i.outcome === "partiallyWorked"
                          ? "Partly worked"
                          : "Didn't work"}
                      {i.minutes ? ` · effect after ${i.minutes} min` : ""}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="muted">Not captured yet.</p>
            )}
          </>
        ) : (
          <>
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
                {[5, 15, 30, 60, 90].map((m) => (
                  <button
                    key={m}
                    className={Number(duration) === m ? "selected" : ""}
                    onClick={() => setDuration(m)}
                  >
                    {m} min
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
              <button className="secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button className="primary" onClick={complete}>
                Save details <CheckCircle2 size={17} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
