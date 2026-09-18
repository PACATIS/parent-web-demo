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

export default function SettingsModal({ state, update, reset, onClose }) {
  return (
    <div className="overlay">
      <div className="modal smallmodal">
        <div className="modalhead">
          <div>
            <span className="eyebrow">SETTINGS</span>
            <h2>Demo settings</h2>
          </div>
          <button className="iconbtn" onClick={onClose}>
            <X />
          </button>
        </div>
        <label>
          Appearance
          <select
            value={state.theme}
            onChange={(e) =>
              update((s) => {
                s.theme = e.target.value;
                return s;
              })
            }
          >
            <option value="dark">Default Dark</option>
            <option value="blue">Clinical Blue</option>
          </select>
        </label>
        <label>
          Language
          <select
            value={state.lang}
            onChange={(e) =>
              update((s) => {
                s.lang = e.target.value;
                return s;
              })
            }
          >
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
        </label>
        <button
          className="danger full"
          onClick={() => {
            reset();
            onClose();
          }}
        >
          Reset the demo record
        </button>
        <p className="muted">
          Web version stores the demo record in this browser's localStorage. For
          production, replace this with authenticated server-side storage and
          proper health-data controls.
        </p>
      </div>
    </div>
  );
}
