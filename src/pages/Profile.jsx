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

import { Header, Card } from "../components/shared.jsx";
export default function Profile({ state }) {
  return (
    <>
      <Header
        title="Profile"
        subtitle="The care record that informs every suggestion."
      />
      <Card className="profilehead">
        <div className="avatar big">LM</div>
        <div>
          <h2>{state.recipient.name}</h2>
          <p>
            {state.recipient.age} years old · Parent/guardian-managed record
          </p>
        </div>
      </Card>
      <div className="twocol">
        <Card>
          <h3>Points of vigilance</h3>
          {state.recipient.vigilance.map((x) => (
            <div className="listitem" key={x}>
              <AlertTriangle size={16} />
              {x}
            </div>
          ))}
        </Card>
        <Card>
          <h3>Care approach</h3>
          <div className="listitem">
            <CheckCircle2 size={16} />
            Offer fidget at first cue
          </div>
          <div className="listitem">
            <CheckCircle2 size={16} />
            Use visual warnings for transitions
          </div>
          <div className="listitem">
            <CheckCircle2 size={16} />
            Avoid unannounced touch
          </div>
        </Card>
      </div>
      <Card>
        <div className="cardtitle">
          <div>
            <h3>Care team</h3>
            <p>{state.team.length} people attached to this record</p>
          </div>
          <button className="secondary">
            <Plus size={16} /> Add member
          </button>
        </div>
        {state.team.map((m) => (
          <div className="team" key={m.id}>
            <div className="avatar small">
              {m.name
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <b>{m.name}</b>
              <span>
                {m.role}
                {m.org ? ` · ${m.org}` : ""}
              </span>
            </div>
            <em>
              {m.lastShared ? `Updated ${m.lastShared}` : "No update yet"}
            </em>
          </div>
        ))}
      </Card>
    </>
  );
}
