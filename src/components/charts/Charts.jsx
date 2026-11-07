import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS, CHART_COLORS, TOOLTIP } from "../../lib/palette";

export function PaymentMethodsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="method" innerRadius={50} outerRadius={85} paddingAngle={3}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function OutstandingChart({ outstanding, collected }) {
  const data = [
    { name: "Outstanding", value: outstanding, fill: "#a6512e" },
    { name: "Collected", value: collected, fill: "#5b7553" },
  ];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barSize={56}>
        <CartesianGrid strokeDasharray="4 4" stroke="#e6d9bc" vertical={false} />
        <XAxis dataKey="name" tick={AXIS} axisLine={{ stroke: "#e6d9bc" }} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} width={48} />
        <Tooltip contentStyle={TOOLTIP} cursor={{ fill: "#f6efdf" }} />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8862e" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#b8862e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="#e6d9bc" vertical={false} />
        <XAxis dataKey="month" tick={AXIS} axisLine={{ stroke: "#e6d9bc" }} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} width={48} />
        <Tooltip contentStyle={TOOLTIP} />
        <Area type="monotone" dataKey="total" stroke="#96691e" strokeWidth={2.5} fill="url(#trendFill)" dot={{ r: 3, fill: "#96691e" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TopDebtorsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 16 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#e6d9bc" horizontal={false} />
        <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ ...AXIS, fill: "#6b5744" }} axisLine={false} tickLine={false} width={86} />
        <Tooltip contentStyle={TOOLTIP} cursor={{ fill: "#f6efdf" }} />
        <Bar dataKey="balance" fill="#b8862e" radius={[0, 8, 8, 0]} barSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
