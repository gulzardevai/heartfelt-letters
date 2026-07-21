'use client'

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const ROSE = ['#e11d48', '#fb7185', '#fda4af', '#fecdd3']

type DayPoint = { day: string; count: number }
type TypePoint = { type: string; count: number }

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  )
}

function fillDays(points: DayPoint[], days = 30): DayPoint[] {
  const map = new Map(points.map((p) => [p.day, p.count]))
  const out: DayPoint[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000)
    const key = d.toISOString().slice(0, 10)
    out.push({ day: key, count: map.get(key) ?? 0 })
  }
  return out
}

const shortDay = (d: string) =>
  new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

export default function AdminCharts({
  lettersPerDay, signupsPerDay, lettersByType, anonLetters, accountLetters,
}: {
  lettersPerDay: DayPoint[]
  signupsPerDay: DayPoint[]
  lettersByType: TypePoint[]
  anonLetters: number
  accountLetters: number
}) {
  const donutData = [
    { name: 'Registered', value: accountLetters },
    { name: 'Anonymous', value: anonLetters },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ChartCard title="Letters created — last 30 days">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={fillDays(lettersPerDay)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="day" tickFormatter={shortDay} tick={{ fontSize: 11, fill: '#9ca3af' }} minTickGap={30} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} width={32} />
            <Tooltip labelFormatter={(label) => shortDay(String(label))} />
            <Area type="monotone" dataKey="count" name="Letters" stroke="#e11d48" fill="#fecdd3" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="User signups — last 30 days">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={fillDays(signupsPerDay)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="day" tickFormatter={shortDay} tick={{ fontSize: 11, fill: '#9ca3af' }} minTickGap={30} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} width={32} />
            <Tooltip labelFormatter={(label) => shortDay(String(label))} />
            <Area type="monotone" dataKey="count" name="Signups" stroke="#fb7185" fill="#fecdd3" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Letters by type">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={lettersByType}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#9ca3af' }} interval={0} angle={-30} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} width={32} />
            <Tooltip />
            <Bar dataKey="count" name="Letters" radius={[4, 4, 0, 0]}>
              {lettersByType.map((_, i) => (
                <Cell key={i} fill={ROSE[i % ROSE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Anonymous vs registered letters">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={donutData} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
              <Cell fill="#e11d48" />
              <Cell fill="#fda4af" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
