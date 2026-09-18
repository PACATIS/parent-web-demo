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

import { Header, Card, EpisodeRow } from "../components/shared.jsx";
export default function Journal({ state, onLog, onSelect }) {
  const cs = [...state.crises].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );
  const incomplete = cs.filter((c) => c.needsDetails).length;
  return (
    <>
      <Header
        title="Journal"
        subtitle="Every episode, in one place."
        action={
          <button className="primary" onClick={onLog}>
            <Plus size={18} /> Log
          </button>
        }
      />
      {incomplete > 0 && (
        <div className="incompletebanner">
          <b>
            {incomplete} episode{incomplete > 1 ? "s" : ""} need more detail
          </b>
          <span>You can open one later when there is time.</span>
        </div>
      )}
      <Card>
        {cs.map((c) => (
          <EpisodeRow key={c.id} c={c} onClick={() => onSelect(c)} />
        ))}
      </Card>
    </>
  );
}
