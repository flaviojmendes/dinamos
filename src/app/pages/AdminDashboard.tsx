import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, subDays, subMonths } from 'date-fns'
import Navbar from '../components/Navbar'
import { Stat, TacticalButton, Panel } from '../../components/tactical'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'

interface UserGrowthData {
  date: string
  count: number
}

interface UserGrowthResponse {
  data: UserGrowthData[]
  total_new_users: number
  start_date: string
  end_date: string
}

interface DashboardData {
  users: {
    total: number
    active_30_days: number
    new_this_week: number
  }
  challenges: {
    total: number
    submitted_solutions: number
    users_completed: number
    solutions_per_challenge: Array<{
      challenge_id: string
      title: string
      count: number
    }>
    completion_rate: number
  }
  step_dropout: Array<{
    step: string
    count: number
    key: string
  }>
  total_drafts: number
  quizzes: {
    total: number
    published: number
    total_attempts: number
    unique_takers: number
    avg_score: number
    quiz_stats: Array<{
      id: number
      title: string
      theme: string
      attempts: number
      unique_users: number
      avg_score: number
    }>
    themes: Array<{
      theme: string
      count: number
    }>
  }
  forum: {
    total_topics: number
    total_messages: number
    categories: Array<{
      category: string
      count: number
    }>
  }
  activity_timeline: Array<{
    date: string
    solutions: number
    quiz_attempts: number
    reads: number
    new_users: number
  }>
  recent_activity: Array<{
    type: string
    id: number
    user_nickname: string
    challenge_title: string
    created_at: string
  }>
}

interface ContentAnalytics {
  range_days: number
  views: {
    total: number
    unique_visitors: number
    most_visited_modules: Array<{
      moduleId: string
      label: string
      views: number
      uniqueVisitors: number
    }>
    most_visited_pages: Array<{
      path: string
      label: string
      module: string
      views: number
      uniqueVisitors: number
    }>
  }
  progress: {
    modules: Array<{
      moduleId: string
      label: string
      tier: string
      lessonsTotal: number
      completions: number
      distinctUsers: number
      avgCompletionPct: number
    }>
  }
  marked_as_read: {
    total_completions: number
    distinct_pages: number
    distinct_users: number
    top_pages: Array<{
      path: string
      label: string
      module: string
      completions: number
    }>
    timeline: Array<{ date: string; count: number }>
  }
}

// Simple bar component for charts
const BarChart = ({ 
  data, 
  labelKey, 
  valueKey, 
  color = 'bg-brand-600 dark:bg-signal-cyan',
  maxItems = 10 
}: { 
  data: Array<Record<string, any>>
  labelKey: string
  valueKey: string
  color?: string
  maxItems?: number
}) => {
  const slicedData = data.slice(0, maxItems)
  const maxValue = Math.max(...slicedData.map(d => d[valueKey] || 0), 1)
  
  return (
    <div className="space-y-2">
      {slicedData.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-32 text-sm text-slate-600 dark:text-tactical-dim truncate" title={item[labelKey]}>
            {item[labelKey]}
          </div>
          <div className="flex-1 bg-slate-200 dark:bg-tactical-raised h-6 overflow-hidden">
            <div 
              className={`${color} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
              style={{ width: `${Math.max((item[valueKey] / maxValue) * 100, 5)}%` }}
            >
              <span className="text-xs font-medium text-white">{item[valueKey]}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Donut chart component
const DonutChart = ({ 
  data, 
  labelKey, 
  valueKey,
  colors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280']
}: { 
  data: Array<Record<string, any>>
  labelKey: string
  valueKey: string
  colors?: string[]
}) => {
  const total = data.reduce((sum, item) => sum + (item[valueKey] || 0), 0)
  let cumulativePercentage = 0
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-400">
        Sem dados
      </div>
    )
  }
  
  const segments = data.map((item, index) => {
    const percentage = ((item[valueKey] || 0) / total) * 100
    const startAngle = cumulativePercentage * 3.6
    cumulativePercentage += percentage
    const endAngle = cumulativePercentage * 3.6
    
    return {
      ...item,
      percentage,
      color: colors[index % colors.length],
      startAngle,
      endAngle
    }
  })
  
  const createArcPath = (startAngle: number, endAngle: number, radius: number = 40) => {
    const startRad = (startAngle - 90) * Math.PI / 180
    const endRad = (endAngle - 90) * Math.PI / 180
    const x1 = 50 + radius * Math.cos(startRad)
    const y1 = 50 + radius * Math.sin(startRad)
    const x2 = 50 + radius * Math.cos(endRad)
    const y2 = 50 + radius * Math.sin(endRad)
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
    
    return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
  }
  
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        {segments.map((seg, i) => (
          <path
            key={i}
            d={createArcPath(seg.startAngle, seg.endAngle)}
            fill={seg.color}
            className="transition-opacity hover:opacity-80"
          />
        ))}
        <circle cx="50" cy="50" r="25" className="fill-white dark:fill-tactical-bg" />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 dark:fill-tactical-text text-[10px] font-bold font-mono">
          {total}
        </text>
      </svg>
      <div className="flex-1 space-y-1">
        {segments.slice(0, 6).map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-slate-600 dark:text-tactical-dim truncate flex-1">{seg[labelKey as keyof typeof seg]}</span>
            <span className="font-mono tabular-nums font-medium text-slate-700 dark:text-tactical-text">{seg[valueKey as keyof typeof seg]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Multi-series area/line chart for the activity timeline. Plots solutions,
// quiz attempts and content reads on a shared scale, with a hover tooltip,
// gridlines, y-axis ticks and date ticks.
const ACTIVITY_SERIES = [
  { key: 'reads', label: 'Leituras', stroke: '#f59e0b', fill: '#f59e0b' },
  { key: 'quiz_attempts', label: 'Quizzes', stroke: '#06b6d4', fill: '#06b6d4' },
  { key: 'solutions', label: 'Soluções', stroke: '#22c55e', fill: '#22c55e' },
] as const

const ActivityChart = ({ data }: { data: DashboardData['activity_timeline'] }) => {
  const [hover, setHover] = useState<number | null>(null)

  const maxValue = Math.max(
    1,
    ...data.flatMap((d) => ACTIVITY_SERIES.map((s) => d[s.key] as number))
  )

  const width = 1000
  const height = 220
  const padLeft = 32
  const padRight = 12
  const padTop = 16
  const padBottom = 28
  const plotW = width - padLeft - padRight
  const plotH = height - padTop - padBottom

  const n = data.length
  const getX = (i: number) => padLeft + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW)
  const getY = (v: number) => padTop + plotH - (v / maxValue) * plotH

  // Smooth-ish line via simple straight segments (crisp + cheap).
  const linePath = (key: (typeof ACTIVITY_SERIES)[number]['key']) =>
    data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(2)} ${getY(d[key] as number).toFixed(2)}`)
      .join(' ')

  const areaPath = (key: (typeof ACTIVITY_SERIES)[number]['key']) => {
    if (n === 0) return ''
    const top = data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(2)} ${getY(d[key] as number).toFixed(2)}`)
      .join(' ')
    return `${top} L ${getX(n - 1).toFixed(2)} ${padTop + plotH} L ${getX(0).toFixed(2)} ${padTop + plotH} Z`
  }

  // 4 horizontal gridlines / y-ticks.
  const ticks = 4
  const yTickVals = Array.from({ length: ticks + 1 }, (_, k) => Math.round((maxValue / ticks) * k))

  const fmtDate = (s: string) => format(new Date(s), 'dd/MM')
  const dateTickEvery = Math.max(1, Math.ceil(n / 8))

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height: 220 }}
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          {ACTIVITY_SERIES.map((s) => (
            <linearGradient key={s.key} id={`act-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.fill} stopOpacity="0.28" />
              <stop offset="100%" stopColor={s.fill} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Y gridlines + tick labels */}
        {yTickVals.map((val, k) => {
          const y = getY(val)
          return (
            <g key={k}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                className="stroke-slate-200 dark:stroke-tactical-border"
                strokeWidth={k === 0 ? 1 : 0.5}
                strokeDasharray={k === 0 ? undefined : '4'}
              />
              <text
                x={padLeft - 6}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-slate-400 dark:fill-slate-500"
                style={{ fontSize: '10px' }}
              >
                {val}
              </text>
            </g>
          )
        })}

        {/* Area fills (drawn first, low opacity) */}
        {ACTIVITY_SERIES.map((s) => (
          <path key={`area-${s.key}`} d={areaPath(s.key)} fill={`url(#act-grad-${s.key})`} />
        ))}

        {/* Lines */}
        {ACTIVITY_SERIES.map((s) => (
          <path
            key={`line-${s.key}`}
            d={linePath(s.key)}
            fill="none"
            stroke={s.stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Hover guide + points */}
        {hover !== null && (
          <line
            x1={getX(hover)}
            y1={padTop}
            x2={getX(hover)}
            y2={padTop + plotH}
            className="stroke-slate-300 dark:stroke-tactical-dim"
            strokeWidth="1"
          />
        )}
        {hover !== null &&
          ACTIVITY_SERIES.map((s) => (
            <circle
              key={`pt-${s.key}`}
              cx={getX(hover)}
              cy={getY(data[hover][s.key] as number)}
              r="3"
              fill={s.stroke}
              className="stroke-white dark:stroke-tactical-bg"
              strokeWidth="1.5"
            />
          ))}

        {/* Date tick labels */}
        {data.map((d, i) =>
          i % dateTickEvery === 0 || i === n - 1 ? (
            <text
              key={`xt-${d.date}`}
              x={getX(i)}
              y={height - 8}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-slate-500"
              style={{ fontSize: '10px' }}
            >
              {fmtDate(d.date)}
            </text>
          ) : null
        )}

        {/* Invisible hover hit-areas */}
        {data.map((_, i) => (
          <rect
            key={`hit-${i}`}
            x={getX(i) - (plotW / Math.max(n, 1)) / 2}
            y={padTop}
            width={plotW / Math.max(n, 1)}
            height={plotH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {hover !== null && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <span className="font-mono font-medium text-slate-700 dark:text-tactical-text">
            {format(new Date(data[hover].date), 'dd MMM')}
          </span>
          {ACTIVITY_SERIES.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.stroke }} />
              <span className="text-slate-500 dark:text-tactical-dim">{s.label}</span>
              <span className="font-mono tabular-nums font-medium text-slate-700 dark:text-tactical-text">
                {data[hover][s.key] as number}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2">
        {ACTIVITY_SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: s.stroke }} />
            <span className="text-xs font-medium text-slate-600 dark:text-tactical-dim">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Stat card component
const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: _icon, 
  color = 'sky',
  trend
}: { 
  title: string
  value: number | string
  subtitle?: string
  icon: React.ReactNode
  color?: 'sky' | 'emerald' | 'violet' | 'amber' | 'rose'
  trend?: { value: number, label: string }
}) => {
  const statColorMap = { sky: 'cyan' as const, emerald: 'green' as const, violet: 'cyan' as const, amber: 'amber' as const, rose: 'red' as const }
  const sub = [subtitle, trend?.label].filter(Boolean).join(' · ') || undefined
  return (
    <Stat
      value={value}
      label={title}
      sub={sub}
      color={statColorMap[color]}
      className=""
    />
  )
}

// User Growth Chart with date range picker
const UserGrowthChart = () => {
  const [data, setData] = useState<UserGrowthData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalNewUsers, setTotalNewUsers] = useState(0)
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d')
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const fetchUserGrowth = async (start: string, end: string) => {
    try {
      setLoading(true)
      const response = await api.get<UserGrowthResponse>(`/api/admin/user-growth?start_date=${start}&end_date=${end}`)
      setData(response.data.data)
      setTotalNewUsers(response.data.total_new_users)
    } catch (error) {
      console.error('Error fetching user growth:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let start = startDate
    let end = endDate
    
    switch (dateRange) {
      case '7d':
        start = format(subDays(new Date(), 7), 'yyyy-MM-dd')
        end = format(new Date(), 'yyyy-MM-dd')
        break
      case '30d':
        start = format(subDays(new Date(), 30), 'yyyy-MM-dd')
        end = format(new Date(), 'yyyy-MM-dd')
        break
      case '90d':
        start = format(subMonths(new Date(), 3), 'yyyy-MM-dd')
        end = format(new Date(), 'yyyy-MM-dd')
        break
      case 'custom':
        // Use the current startDate and endDate
        break
    }
    
    if (dateRange !== 'custom') {
      setStartDate(start)
      setEndDate(end)
    }
    
    fetchUserGrowth(start, end)
  }, [dateRange])

  useEffect(() => {
    if (dateRange === 'custom') {
      fetchUserGrowth(startDate, endDate)
    }
  }, [startDate, endDate, dateRange])

  const maxCount = Math.max(...data.map(d => d.count), 1)
  const chartHeight = 180
  // Use a fixed viewBox width and let bars distribute evenly
  const chartWidth = 1000
  const padding = 40
  
  // Calculate bar width to fill the available space
  const availableWidth = chartWidth - (padding * 2)
  const barGap = Math.max(2, availableWidth / data.length * 0.15)
  const barWidth = data.length > 0 ? (availableWidth - (barGap * (data.length - 1))) / data.length : 20

  const getBarHeight = (count: number) => {
    return (count / maxCount) * (chartHeight - 40)
  }
  
  const getBarX = (index: number) => {
    return padding + index * (barWidth + barGap)
  }

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    return format(date, 'dd/MM')
  }

  return (
    <Panel title="Novos Usuários" accent="green" padded={false} bodyClassName="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 px-6 pt-4">
        <h2 className="font-sans text-sm font-bold text-slate-900 dark:text-tactical-text flex items-center gap-2 sr-only">
          <svg className="w-5 h-5 text-signal-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Novos Usuários
          {!loading && (
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
              ({totalNewUsers} no período)
            </span>
          )}
        </h2>
        
        {/* Date Range Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-tactical-border">
            {(['7d', '30d', '90d', 'custom'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                    : 'bg-white dark:bg-tactical-raised text-slate-600 dark:text-tactical-dim hover:bg-slate-50 dark:hover:bg-tactical-surface'
                }`}
              >
                {range === '7d' ? '7 dias' : range === '30d' ? '30 dias' : range === '90d' ? '90 dias' : 'Personalizado'}
              </button>
            ))}
          </div>
          
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1.5 text-xs rounded-md border border-slate-300 dark:border-tactical-border bg-white dark:bg-tactical-surface text-slate-900 dark:text-tactical-text focus:ring-brand-500 dark:focus:ring-signal-green"
              />
              <span className="text-slate-400 text-xs">até</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1.5 text-xs rounded-md border border-slate-300 dark:border-tactical-border bg-white dark:bg-tactical-surface text-slate-900 dark:text-tactical-text focus:ring-brand-500 dark:focus:ring-signal-green"
              />
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 dark:border-signal-green"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-slate-400">
          Nenhum dado disponível para o período selecionado
        </div>
      ) : (
        <div className="w-full">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full" 
            style={{ height: chartHeight }}
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <line 
              x1={padding} y1={chartHeight - 25} 
              x2={chartWidth - padding} y2={chartHeight - 25} 
              className="stroke-slate-200 dark:stroke-slate-700" 
              strokeWidth="1" 
            />
            <line 
              x1={padding} y1={(chartHeight - 40) / 2 + 10} 
              x2={chartWidth - padding} y2={(chartHeight - 40) / 2 + 10} 
              className="stroke-slate-200 dark:stroke-slate-700" 
              strokeWidth="0.5" 
              strokeDasharray="4" 
            />
            
            {/* Y-axis max value label */}
            <text
              x={padding - 5}
              y="18"
              textAnchor="end"
              className="fill-slate-400 dark:fill-slate-500"
              style={{ fontSize: '10px' }}
            >
              {maxCount}
            </text>
            
            {/* Y-axis zero label */}
            <text
              x={padding - 5}
              y={chartHeight - 28}
              textAnchor="end"
              className="fill-slate-400 dark:fill-slate-500"
              style={{ fontSize: '10px' }}
            >
              0
            </text>
            
            {/* Bars */}
            {data.map((item, index) => {
              const barHeight = getBarHeight(item.count)
              const x = getBarX(index)
              const y = chartHeight - 25 - barHeight
              
              return (
                <g key={item.date}>
                  {/* Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={Math.max(barWidth, 3)}
                    height={Math.max(barHeight, 0)}
                    rx="2"
                    className="fill-brand-600 dark:fill-signal-green hover:opacity-80 transition-opacity cursor-pointer"
                  />
                  
                  {/* Value label (shown for bars with data) */}
                  {item.count > 0 && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 4}
                      textAnchor="middle"
                      className="fill-slate-600 dark:fill-slate-300"
                      style={{ fontSize: '9px', fontWeight: 500 }}
                    >
                      {item.count}
                    </text>
                  )}
                  
                  {/* Date labels (show every nth label based on data length) */}
                  {(data.length <= 15 || index % Math.ceil(data.length / 10) === 0) && (
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight - 5}
                      textAnchor="middle"
                      className="fill-slate-400 dark:fill-slate-500"
                      style={{ fontSize: '9px' }}
                    >
                      {formatDateLabel(item.date)}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      )}
      
      {/* Summary stats */}
      {!loading && data.length > 0 && (
        <div className="flex gap-4 mt-4 pt-4 px-6 pb-4 border-t border-slate-200 dark:border-tactical-border">
          <div className="flex-1 text-center">
            <div className="text-xl font-mono font-bold tabular-nums text-signal-green">{totalNewUsers}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mt-1">Total de novos usuários</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-xl font-mono font-bold tabular-nums text-slate-900 dark:text-tactical-text">
              {(totalNewUsers / data.length).toFixed(1)}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mt-1">Média por dia</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-xl font-mono font-bold tabular-nums text-slate-900 dark:text-tactical-text">
              {Math.max(...data.map(d => d.count))}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mt-1">Pico diário</div>
          </div>
        </div>
      )}
    </Panel>
  )
}

// Mini line chart for the "marked as read" timeline.
const ReadTimelineChart = ({ data }: { data: ContentAnalytics['marked_as_read']['timeline'] }) => {
  const maxValue = Math.max(...data.map(d => d.count), 1)
  const height = 120
  const width = Math.max(data.length * 10, 10)
  const getY = (value: number) => height - (value / maxValue) * (height - 20)
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * 10 + 5} ${getY(d.count)}`).join(' ')
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32" preserveAspectRatio="none">
        <line x1="0" y1={height - 10} x2={width} y2={height - 10} className="stroke-slate-200 dark:stroke-tactical-border" strokeWidth="1" />
        <path d={path} fill="none" className="stroke-signal-green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="text-center mt-2 text-xs font-medium text-slate-500 dark:text-tactical-dim">
        {total} marcações no período
      </div>
    </div>
  )
}

// Anonymized content engagement analytics (views, progress, marked-as-read).
const ContentAnalyticsSection = () => {
  const [data, setData] = useState<ContentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [days, setDays] = useState<7 | 30 | 90>(30)

  const fetchAnalytics = async (range: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get<ContentAnalytics>(`/api/admin/content-analytics?days=${range}`)
      setData(response.data)
    } catch (err) {
      console.error('Erro ao carregar analytics de conteúdo:', err)
      setError('Não foi possível carregar as métricas de conteúdo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(days)
  }, [days])

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text">
            Conteúdo
          </h2>
          <p className="text-sm text-slate-500 dark:text-tactical-label mt-0.5">
            Engajamento anonimizado: progresso, módulos mais visitados e conteúdo marcado como lido
          </p>
        </div>
        <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-tactical-border self-start">
          {([7, 30, 90] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDays(range)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                days === range
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                  : 'bg-white dark:bg-tactical-raised text-slate-600 dark:text-tactical-dim hover:bg-slate-50 dark:hover:bg-tactical-surface'
              }`}
            >
              {range} dias
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 dark:border-signal-green"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 border border-signal-red/40 bg-signal-red/10">
          <p className="text-signal-red">{error}</p>
          <TacticalButton variant="danger" onClick={() => fetchAnalytics(days)} className="mt-4">
            Tentar novamente
          </TacticalButton>
        </div>
      ) : data && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Visualizações"
              value={data.views.total}
              subtitle={`Últimos ${data.range_days} dias`}
              color="sky"
              icon={null}
            />
            <StatCard
              title="Visitantes Únicos"
              value={data.views.unique_visitors}
              subtitle="Anônimos (sem identificação)"
              color="violet"
              icon={null}
            />
            <StatCard
              title="Conteúdos Lidos"
              value={data.marked_as_read.total_completions}
              subtitle={`${data.marked_as_read.distinct_users} usuários marcaram`}
              color="emerald"
              icon={null}
            />
            <StatCard
              title="Páginas Lidas"
              value={data.marked_as_read.distinct_pages}
              subtitle="Páginas distintas concluídas"
              color="amber"
              icon={null}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Most visited modules */}
            <Panel title="Módulos Mais Visitados" accent="cyan" className="lg:col-span-1" padded={false} bodyClassName="p-4">
              {data.views.most_visited_modules.length === 0 ? (
                <p className="text-slate-500 dark:text-tactical-label text-sm text-center py-6">Sem visualizações no período</p>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-slate-50 dark:bg-tactical-surface">
                    <tr>
                      <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-left border-b border-slate-200 dark:border-tactical-border">Módulo</th>
                      <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-right border-b border-slate-200 dark:border-tactical-border">Views</th>
                      <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-right border-b border-slate-200 dark:border-tactical-border">Únicos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.views.most_visited_modules.slice(0, 8).map((m) => (
                      <tr key={m.moduleId} className="border-b border-slate-100 dark:border-tactical-border/60 hover:bg-slate-50 dark:hover:bg-tactical-raised">
                        <td className="py-2.5 px-3 text-slate-800 dark:text-tactical-text truncate" title={m.label}>{m.label}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-tactical-text">{m.views}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-tactical-dim">{m.uniqueVisitors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Panel>

            {/* Most visited pages */}
            <Panel title="Páginas Mais Visitadas" accent="cyan" className="lg:col-span-2">
              {data.views.most_visited_pages.length === 0 ? (
                <p className="text-slate-500 dark:text-tactical-label text-sm text-center py-6">Sem visualizações no período</p>
              ) : (
                <BarChart
                  data={data.views.most_visited_pages}
                  labelKey="label"
                  valueKey="views"
                  color="bg-brand-600 dark:bg-signal-cyan"
                  maxItems={8}
                />
              )}
            </Panel>

            {/* Progress through modules */}
            <Panel title="Progresso por Módulo" accent="green" className="lg:col-span-3" padded={false} bodyClassName="p-4">
              <p className="text-sm text-slate-600 dark:text-tactical-dim mb-4 px-1">
                Quantos usuários avançaram em cada módulo (lições marcadas como concluídas), sem identificação individual
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-slate-50 dark:bg-tactical-surface">
                    <tr>
                      <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-left border-b border-slate-200 dark:border-tactical-border">Módulo</th>
                      <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-left border-b border-slate-200 dark:border-tactical-border">Tier</th>
                      <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-center border-b border-slate-200 dark:border-tactical-border">Lições</th>
                      <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-center border-b border-slate-200 dark:border-tactical-border">Usuários ativos</th>
                      <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-center border-b border-slate-200 dark:border-tactical-border">Conclusões</th>
                      <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-right border-b border-slate-200 dark:border-tactical-border">Progresso médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.progress.modules.map((m) => (
                      <tr key={m.moduleId} className="border-b border-slate-100 dark:border-tactical-border/60 hover:bg-slate-50 dark:hover:bg-tactical-raised">
                        <td className="py-2.5 px-3 text-slate-800 dark:text-tactical-text">{m.label}</td>
                        <td className="py-2.5 px-3 text-xs text-slate-500 dark:text-tactical-dim">{m.tier}</td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-600 dark:text-tactical-dim">{m.lessonsTotal}</td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-700 dark:text-tactical-text">{m.distinctUsers}</td>
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-600 dark:text-tactical-dim">{m.completions}</td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-24 h-2 bg-slate-200 dark:bg-tactical-raised rounded-full overflow-hidden">
                              <div className="h-full bg-signal-green rounded-full" style={{ width: `${Math.min(m.avgCompletionPct, 100)}%` }} />
                            </div>
                            <span className="font-mono tabular-nums text-xs text-slate-700 dark:text-tactical-text w-12 text-right">{m.avgCompletionPct}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {data.progress.modules.length === 0 && (
                      <tr><td colSpan={6} className="py-6 text-center text-slate-500 dark:text-tactical-label">Sem dados de progresso</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>

            {/* Marked as read: top pages */}
            <Panel title="Conteúdo Mais Marcado como Lido" accent="green" className="lg:col-span-2">
              {data.marked_as_read.top_pages.length === 0 ? (
                <p className="text-slate-500 dark:text-tactical-label text-sm text-center py-6">Nenhum conteúdo marcado como lido ainda</p>
              ) : (
                <BarChart
                  data={data.marked_as_read.top_pages}
                  labelKey="label"
                  valueKey="completions"
                  color="bg-signal-green"
                  maxItems={8}
                />
              )}
            </Panel>

            {/* Marked as read: timeline */}
            <Panel title="Marcações no Período" accent="green" className="lg:col-span-1">
              <ReadTimelineChart data={data.marked_as_read.timeline} />
            </Panel>
          </div>
        </>
      )}
    </div>
  )
}

function AdminDashboard() {
  const { appUser, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && appUser && !['Admin', 'Tutor'].includes(appUser.role || '')) {
      navigate('/design-lab')
    }
  }, [appUser, authLoading, navigate])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await api.get<DashboardData>('/api/admin/dashboard')
      setData(response.data)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      setError('Não foi possível carregar os dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-signal-green"></div>
        </div>
      </>
    )
  }

  if (!appUser || !['Admin', 'Tutor'].includes(appUser.role || '')) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text">
              Dashboard administrativo
            </h1>
            <p className="text-slate-500 dark:text-tactical-label mt-1">
              Visão geral da plataforma e métricas de engajamento
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-signal-green"></div>
            </div>
          ) : error ? (
            <div className="text-center p-12 border border-signal-red/40 bg-signal-red/10">
              <p className="text-signal-red">{error}</p>
              <TacticalButton variant="danger" onClick={fetchDashboard} className="mt-4">
                Tentar novamente
              </TacticalButton>
            </div>
          ) : data && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Total de Usuários"
                  value={data.users.total}
                  subtitle={`${data.users.active_30_days} ativos (30 dias)`}
                  color="sky"
                  trend={{ value: data.users.new_this_week, label: `+${data.users.new_this_week} esta semana` }}
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                />
                <StatCard
                  title="Desafios Enviados"
                  value={data.challenges.submitted_solutions}
                  subtitle={`${data.challenges.users_completed} usuários completaram`}
                  color="emerald"
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  }
                />
                <StatCard
                  title="Quizzes Respondidos"
                  value={data.quizzes.total_attempts}
                  subtitle={`Média: ${data.quizzes.avg_score}%`}
                  color="violet"
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <StatCard
                  title="Usuários Ativos (30d)"
                  value={data.users.active_30_days}
                  subtitle={`${Math.round((data.users.active_30_days / data.users.total) * 100) || 0}% do total · quizzes, desafios ou leitura`}
                  color="amber"
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                />
              </div>

              {/* User Growth Chart - Full width */}
              <div className="mb-8">
                <UserGrowthChart />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Step Dropout Analysis - Takes 2 columns */}
                <Panel title="Onde os Usuários Pararam (Rascunhos)" accent="red" className="lg:col-span-2">
                  <p className="text-sm text-slate-600 dark:text-tactical-dim mb-4">
                    Análise de {data.total_drafts} rascunhos não enviados - em qual etapa do wizard os usuários abandonaram
                  </p>
                  <BarChart 
                    data={data.step_dropout}
                    labelKey="step"
                    valueKey="count"
                    color="bg-signal-red"
                  />
                </Panel>

                {/* Forum Stats */}
                <Panel title="Fórum" accent="cyan" className="">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-slate-50 dark:bg-tactical-raised p-3 text-center">
                      <div className="text-2xl font-mono font-bold tabular-nums text-slate-900 dark:text-tactical-text">{data.forum.total_topics}</div>
                      <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mt-1">Tópicos</div>
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-tactical-raised p-3 text-center">
                      <div className="text-2xl font-mono font-bold tabular-nums text-slate-900 dark:text-tactical-text">{data.forum.total_messages}</div>
                      <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mt-1">Mensagens</div>
                    </div>
                  </div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">Por categoria</h3>
                  <DonutChart 
                    data={data.forum.categories}
                    labelKey="category"
                    valueKey="count"
                    colors={['#22c55e', '#06b6d4', '#f59e0b', '#ef4444', '#94a3b8']}
                  />
                </Panel>

                <Panel title="Atividade (Últimos 30 dias)" accent="green" className="lg:col-span-2">
                  <ActivityChart data={data.activity_timeline} />
                </Panel>

                <Panel title="Quizzes por Tema" accent="cyan" className="">
                  <DonutChart 
                    data={data.quizzes.themes}
                    labelKey="theme"
                    valueKey="count"
                    colors={['#06b6d4', '#22c55e', '#f59e0b', '#f472b6', '#94a3b8']}
                  />
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-tactical-border grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-xl font-mono font-bold tabular-nums text-slate-900 dark:text-tactical-text">{data.quizzes.published}</div>
                      <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mt-1">Publicados</div>
                    </div>
                    <div>
                      <div className="text-xl font-mono font-bold tabular-nums text-slate-900 dark:text-tactical-text">{data.quizzes.unique_takers}</div>
                      <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mt-1">Participantes únicos</div>
                    </div>
                  </div>
                </Panel>

                <Panel title="Desafios Mais Resolvidos" accent="green" className="">
                  <BarChart 
                    data={data.challenges.solutions_per_challenge}
                    labelKey="title"
                    valueKey="count"
                    color="bg-signal-green"
                    maxItems={5}
                  />
                </Panel>

                <Panel title="Performance dos Quizzes" accent="amber" className="lg:col-span-2" padded={false} bodyClassName="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead className="bg-slate-50 dark:bg-tactical-surface">
                        <tr>
                          <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-left border-b border-slate-200 dark:border-tactical-border">Quiz</th>
                          <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-left border-b border-slate-200 dark:border-tactical-border">Tema</th>
                          <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-center border-b border-slate-200 dark:border-tactical-border">Tentativas</th>
                          <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-center border-b border-slate-200 dark:border-tactical-border">Usuários</th>
                          <th className="text-xs font-medium text-slate-500 dark:text-tactical-label pb-3 px-3 text-right border-b border-slate-200 dark:border-tactical-border">Média</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.quizzes.quiz_stats.slice(0, 6).map((quiz) => (
                          <tr key={quiz.id} className="border-b border-slate-100 dark:border-tactical-border/60 hover:bg-slate-50 dark:hover:bg-tactical-raised">
                            <td className="py-3 px-3 text-slate-800 dark:text-tactical-text">{quiz.title}</td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                                {quiz.theme}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600 dark:text-tactical-dim">{quiz.attempts}</td>
                            <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600 dark:text-tactical-dim">{quiz.unique_users}</td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums">
                              <span className={
                                quiz.avg_score >= 70 ? 'text-signal-green' :
                                quiz.avg_score >= 50 ? 'text-signal-amber' :
                                'text-signal-red'
                              }>
                                {quiz.avg_score}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>

                <Panel title="Atividade Recente" accent="green" className="">
                  <div className="space-y-3">
                    {data.recent_activity.slice(0, 8).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 text-sm">
                        <div className="w-8 h-8 border border-signal-green/40 bg-signal-green/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-signal-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 dark:text-tactical-text">
                            <span className="font-medium">{activity.user_nickname || 'Usuário'}</span>
                            {' completou '}
                            <span className="font-medium">{activity.challenge_title}</span>
                          </p>
                          <p className="text-xs text-slate-500 dark:text-tactical-label">
                            {activity.created_at ? new Date(activity.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                    {data.recent_activity.length === 0 && (
                      <p className="text-slate-500 dark:text-tactical-label text-sm text-center py-4">
                        Nenhuma atividade recente
                      </p>
                    )}
                  </div>
                </Panel>
              </div>

              {/* Anonymized content engagement analytics */}
              <ContentAnalyticsSection />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminDashboard

