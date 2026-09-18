import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Heart,
  Home,
  Menu,
  Pill,
  Plus,
  Settings,
  Share2,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { measureStats } from "../analytics/analytics.js";
import { ANCHOR, fmt, fmtDateTime, period } from "../data/seed.js";
import { Card, Header, Stat, EpisodeRow } from "../components/shared.jsx";
export default function Today({ state, onLog, onInsights }) {
  const crises = [...state.crises].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );
  const best = measureStats(state.crises)[0];
  const recent = state.crises.filter(
    (c) => new Date(c.timestamp) >= new Date(ANCHOR - 28 * 86400000),
  ).length;
  return (
    <>
      <Header
        title="Today"
        subtitle="What matters for Lea, first."
        action={
          <button className="primary" onClick={onLog}>
            <Plus size={18} /> Log a crisis
          </button>
        }
      />
      <Card className="recipient">
        <div className="avatar big">LM</div>
        <div>
          <h2>
            {state.recipient.name}, {state.recipient.age}
          </h2>
          <p>{state.recipient.summary}</p>
        </div>
      </Card>
      <div className="vigilance">
        <AlertTriangle size={18} />
        <div>
          <b>Points of vigilance</b>
          <ul>
            {state.recipient.vigilance.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <Card className="intelligence">
        <div className="eyebrow">
          <Activity size={15} /> DATA-BASED SUGGESTION
        </div>
        <h2>
          {best
            ? `What tends to work for ${state.recipient.name.split(" ")[0]}`
            : "Log a few episodes to see patterns"}
        </h2>
        <p>
          {best
            ? `“${best.title}” is currently the most reliable measure in this record.`
            : "Suggestions are computed from the family's logged record."}
        </p>
        {best && (
          <div className="suggestions">
            <div>
              <b>{best.title}</b>
              <span>
                {best.attempts} attempts · {Math.round(best.rate * 100)}%
                effective
              </span>
            </div>
            <div className="evidence">
              Evidence attached to the family's own episodes.
            </div>
          </div>
        )}
      </Card>
      <div className="stats">
        <Stat value={recent} label="Crises in last 4 weeks" icon={<Zap />} />
        <Stat
          value={state.crises.length}
          label="Episodes on record"
          icon={<FileText />}
        />
        <Stat
          value={state.medications.length}
          label="Active medications"
          icon={<Pill />}
        />
      </div>
      <Card>
        <div className="cardtitle">
          <div>
            <h3>Recent episodes</h3>
            <p>Latest entries from the care record</p>
          </div>
          <button className="textbtn" onClick={onInsights}>
            Open insights
          </button>
        </div>
        {crises.slice(0, 4).map((c) => (
          <EpisodeRow key={c.id} c={c} />
        ))}
      </Card>
    </>
  );
}
