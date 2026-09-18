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

import { Header } from "../components/shared.jsx";
import { ANCHOR, fmt } from "../data/seed.js";
export default function Calendar({ state, onSelect }) {
  const [mode, setMode] = useState("week");
  const [offset, setOffset] = useState(0);
  const anchor = new Date(ANCHOR);
  anchor.setDate(anchor.getDate() + offset * (mode === "week" ? 7 : 30));
  const start = new Date(anchor);
  start.setDate(anchor.getDate() - (anchor.getDay() || 7) + 1);
  const days =
    mode === "week"
      ? Array.from({ length: 7 }, (_, i) => {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          return d;
        })
      : Array.from({ length: 30 }, (_, i) => {
          const d = new Date(anchor.getFullYear(), anchor.getMonth(), i + 1);
          return d;
        });
  return (
    <>
      <Header
        title="Calendar"
        subtitle={`Crises, medications, cycle and appointments on one timeline.`}
      />
      <div className="toggle">
        <button
          className={mode === "week" ? "selected" : ""}
          onClick={() => setMode("week")}
        >
          Week
        </button>
        <button
          className={mode === "month" ? "selected" : ""}
          onClick={() => setMode("month")}
        >
          Month
        </button>
      </div>
      <div className="calendar-nav">
        <button className="iconbtn" onClick={() => setOffset(offset - 1)}>
          <ChevronLeft />
        </button>
        <b>
          {mode === "week"
            ? `${fmt(days[0])} – ${fmt(days[6])}`
            : anchor.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
        </b>
        <button className="iconbtn" onClick={() => setOffset(offset + 1)}>
          <ChevronRight />
        </button>
      </div>
      <div className={mode === "week" ? "week" : "month"}>
        {days.map((d) => {
          const ev = state.crises.filter(
            (c) => new Date(c.timestamp).toDateString() === d.toDateString(),
          );
          return (
            <div className="day" key={d.toISOString()}>
              <b>
                {d.toLocaleDateString(undefined, {
                  weekday: "short",
                  day: "numeric",
                })}
              </b>
              {ev.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelect(c)}
                  className="cal-event"
                >
                  <span></span>
                  {c.context}
                  <small>
                    {new Date(c.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </button>
              ))}
              {!ev.length && <small className="muted">No events</small>}
            </div>
          );
        })}
      </div>
    </>
  );
}
