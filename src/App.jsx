import React, { useState } from "react";
import {
  CalendarDays,
  FileText,
  Home,
  Settings,
  BarChart3,
  UserRound,
  Plus,
  X,
} from "lucide-react";
import { initial, load, save } from "./data/seed.js";
import { createEpisode, loadApiConfig, toApiPayload } from "./api/episodes.js";
import Today from "./pages/Today.jsx";
import Journal from "./pages/Journal.jsx";
import Insights from "./pages/Insights.jsx";
import Calendar from "./pages/Calendar.jsx";
import Profile from "./pages/Profile.jsx";
import LogModal from "./components/LogModal.jsx";
import EpisodeModal from "./components/EpisodeModal.jsx";
import SettingsModal from "./components/SettingsModal.jsx";

const nav = [
  ["today", "Today", Home],
  ["calendar", "Calendar", CalendarDays],
  ["log", "Log", FileText],
  ["insights", "Insights", BarChart3],
  ["profile", "Profile", UserRound],
];

export default function App() {
  const [state, setState] = useState(load);
  const [tab, setTab] = useState("today");
  const [showLog, setShowLog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [settings, setSettings] = useState(false);

  const update = (fn) => {
    setState((current) => {
      const next = fn(structuredClone(current));
      save(next);
      return next;
    });
  };

  const reset = () => {
    localStorage.removeItem("pacatis-web");
    setState(structuredClone(initial));
  };

  // Quick Capture: the record is written to the PACATIS API. On success the
  // returned episode is merged into local state (kept in localStorage only as
  // a mirror of the server record); on failure we throw so the modal shows the
  // error instead of pretending the record was saved.
  const saveEpisode = async (crisis) => {
    const created = await createEpisode(loadApiConfig(), toApiPayload(crisis));
    update((next) => {
      next.crises.push(created);
      return next;
    });
    setShowLog(false);
  };

  const saveEpisodeLocal = (crisis) => {
    update((next) => {
      next.crises.push(crisis);
      return next;
    });
    setShowLog(false);
  };

  return (
    <div className={"app " + (state.theme === "blue" ? "clinical" : "")}>
      <header className="topbar">
        <div className="brand">
          PACATIS <span>CARE RECORD</span>
        </div>
        <div className="top-recipient">
          <div className="avatar">LM</div>
          <div>
            <b>{state.recipient.name}</b>
            <small>{state.recipient.age} years old</small>
          </div>
        </div>
        <button className="iconbtn" onClick={() => setSettings(true)}>
          <Settings size={18} />
        </button>
      </header>

      <main className="content">
        {tab === "today" && (
          <Today
            state={state}
            onLog={() => setShowLog(true)}
            onInsights={() => setTab("insights")}
          />
        )}
        {tab === "calendar" && (
          <Calendar state={state} onSelect={setSelected} />
        )}
        {tab === "log" && (
          <Journal
            state={state}
            onLog={() => setShowLog(true)}
            onSelect={setSelected}
          />
        )}
        {tab === "insights" && <Insights state={state} />}
        {tab === "profile" && <Profile state={state} />}
      </main>

      <nav className="tabbar">
        {nav.map(([id, label, Icon]) => (
          <button
            key={id}
            className={tab === id ? "active" : ""}
            onClick={() => setTab(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {showLog && (
        <LogModal
          onClose={() => setShowLog(false)}
          onQuickSave={saveEpisode}
          onSave={saveEpisodeLocal}
        />
      )}

      {selected && (
        <EpisodeModal
          crisis={selected}
          onClose={() => setSelected(null)}
          onUpdate={(updated) => {
            update((next) => {
              const i = next.crises.findIndex((x) => x.id === updated.id);
              if (i >= 0) next.crises[i] = updated;
              return next;
            });
            setSelected(updated);
          }}
        />
      )}

      {settings && (
        <SettingsModal
          state={state}
          update={update}
          reset={reset}
          onClose={() => setSettings(false)}
        />
      )}
    </div>
  );
}
