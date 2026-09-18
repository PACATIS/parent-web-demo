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
import { fmtDateTime } from "../data/seed.js";
export function Card({ children, className = "" }) {
  return <section className={"card " + className}>{children}</section>;
}
export function Header({ title, subtitle, action }) {
  return (
    <div className="screenhead">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
export function Stat({ value, label, icon }) {
  return (
    <div className="stat">
      <div>{icon}</div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
export function EpisodeRow({ c, onClick }) {
  return (
    <button className="episode" onClick={onClick}>
      <span className={"severity " + c.severity}>
        {c.severity === "severe"
          ? "+++"
          : c.severity === "moderate"
            ? "++"
            : "+"}
      </span>
      <div>
        <b>{c.context}</b>
        <span>
          {fmtDateTime(c.timestamp)} · {c.duration} min
        </span>
      </div>
      <span className="resolution">
        {c.needsDetails
          ? "Add details"
          : c.resolution === "worked"
            ? "Stopped"
            : c.resolution === "dissipated"
              ? "Reduced"
              : "Unresolved"}
      </span>
    </button>
  );
}
