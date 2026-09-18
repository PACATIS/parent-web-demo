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
import { ANCHOR, period } from "../data/seed.js";
import { Header, Card, Stat } from "../components/shared.jsx";
export default function Insights({ state }) {
  const stats = useMemo(() => measureStats(state.crises), [state.crises]);
  const recent = state.crises.filter(
    (c) => new Date(c.timestamp) >= new Date(ANCHOR - 28 * 86400000),
  ).length;
  const previous = state.crises.length - recent;
  const weekly = Array.from({ length: 8 }, (_, i) => {
    const end = new Date(ANCHOR);
    end.setDate(end.getDate() - (7 - i) * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    return {
      week: `W${i + 1}`,
      count: state.crises.filter((c) => {
        const d = new Date(c.timestamp);
        return d >= start && d < end;
      }).length,
    };
  });
  const periods = ["Morning", "Midday", "Afternoon", "Evening", "Night"].map(
    (p) => ({
      name: p,
      value: state.crises.filter((c) => period(c.timestamp) === p).length,
    }),
  );
  const outcomes = [
    {
      name: "Stopped",
      value: state.crises.filter((c) => c.resolution === "worked").length,
    },
    {
      name: "Reduced",
      value: state.crises.filter((c) => c.resolution === "dissipated").length,
    },
    {
      name: "Unresolved",
      value: state.crises.filter((c) => c.resolution === "unresolved").length,
    },
  ];
  const ants = Object.entries(
    state.crises
      .flatMap((c) => c.antecedents)
      .reduce((a, x) => ((a[x] = (a[x] || 0) + 1), a), {}),
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  return (
    <>
      <Header
        title="Insights"
        subtitle="What eight weeks of logging adds up to."
        action={
          <button className="secondary">
            <Share2 size={17} /> Share with care team
          </button>
        }
      />
      <div className="stats">
        <Stat value={recent} label="Last 4 weeks" icon={<Activity />} />
        <Stat
          value={
            previous
              ? `${Math.round(((recent - previous) / previous) * 100)}%`
              : "—"
          }
          label="vs prior 4 weeks"
          icon={<BarChart3 />}
        />
        <Stat
          value={`${state.crises.length ? Math.round((outcomes[0].value / state.crises.length) * 100) : 0}%`}
          label="Stopped fully"
          icon={<CheckCircle2 />}
        />
      </div>
      <Card>
        <div className="cardtitle">
          <div>
            <h3>How episodes ended</h3>
            <p>{state.crises.length} episodes across the whole record</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={outcomes}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={75}
              label
            >
              {outcomes.map((_, i) => (
                <Cell key={i} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <h3>Episodes per week</h3>
        <p>Last 8 weeks</p>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="currentColor" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <div className="twocol">
        <Card>
          <h3>When episodes start</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={periods} layout="vertical">
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="currentColor" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3>What comes before</h3>
          {ants.map((a) => (
            <div className="rank">
              <span>{a.name}</span>
              <b>{a.count}</b>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <h3>What works</h3>
        <p>Measures remain visible even when they did not help.</p>
        {stats.map((s) => (
          <div className="measure" key={s.title}>
            <div>
              <b>{s.title}</b>
              <span>{s.attempts} attempts</span>
            </div>
            <strong>{Math.round(s.rate * 100)}%</strong>
            <div className="bar">
              <i style={{ width: `${s.rate * 100}%` }} />
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <h3>Quality of life by week</h3>
        <p>Caregiver score is tracked alongside the record.</p>
        <ResponsiveContainer width="100%" height={210}>
          <LineChart
            data={state.wellbeing.map((x, i) => ({
              week: i + 1,
              caregiver: x,
              recipient: x + Math.min(i, 1),
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line dataKey="caregiver" strokeWidth={3} dot />
            <Line dataKey="recipient" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
        <small>
          Illustrative 0–5 demo scores; clinical interpretation requires the
          appropriate validated scoring process.
        </small>
      </Card>
    </>
  );
}
