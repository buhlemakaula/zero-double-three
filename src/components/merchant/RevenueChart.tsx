import { useState } from 'react'
import { motion } from 'framer-motion'
import { REVENUE_7D } from '../../data/merchant'
import { ZAR } from '../../data/catalog'

// Single-series daily revenue (curbside + delivery). Single series → no legend;
// the panel title names it. Recessive axis, 4px rounded bar tops, hover tooltip.
export function RevenueChart() {
  const data = REVENUE_7D.map((d) => ({ day: d.day, total: d.curbside + d.delivery }))
  const max = Math.max(...data.map((d) => d.total))
  const [hover, setHover] = useState<number | null>(null)

  const W = 520
  const H = 200
  const padB = 26
  const padT = 16
  const plotH = H - padB - padT
  const n = data.length
  const gap = 16
  const barW = (W - gap * (n - 1)) / n

  // gridline ticks
  const ticks = [0, 0.5, 1].map((t) => Math.round((max * t) / 1000) * 1000)

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Daily revenue, last 7 days">
        {/* recessive gridlines */}
        {ticks.map((t) => {
          const y = padT + plotH - (t / max) * plotH
          return (
            <g key={t}>
              <line x1={0} x2={W} y1={y} y2={y} stroke="#E7E4DC" strokeWidth={1} />
              {t > 0 && (
                <text x={0} y={y - 4} fill="#8C897F" fontSize={10} fontFamily="Manrope Variable, sans-serif">
                  R{(t / 1000).toFixed(0)}k
                </text>
              )}
            </g>
          )
        })}

        {data.map((d, i) => {
          const h = (d.total / max) * plotH
          const x = i * (barW + gap)
          const y = padT + plotH - h
          const isToday = i === n - 1
          const active = hover === i
          return (
            <g
              key={d.day}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* invisible full-height hit target */}
              <rect x={x} y={padT} width={barW} height={plotH} fill="transparent" />
              <motion.rect
                initial={{ height: 0, y: padT + plotH }}
                whileInView={{ height: h, y }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                x={x}
                width={barW}
                rx={4}
                fill={isToday ? '#B8935E' : '#2E4A39'}
                opacity={active || isToday ? 1 : 0.85}
              />
              <text
                x={x + barW / 2}
                y={H - 8}
                textAnchor="middle"
                fill={isToday ? '#0A0A0A' : '#8C897F'}
                fontSize={11}
                fontWeight={isToday ? 700 : 500}
                fontFamily="Manrope Variable, sans-serif"
              >
                {d.day}
              </text>
            </g>
          )
        })}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute -top-1 rounded-xl border border-line bg-ivory px-3 py-2 shadow-luxe"
          style={{
            left: `${((hover * (barW + gap) + barW / 2) / W) * 100}%`,
            transform: 'translate(-50%,-100%)',
          }}
        >
          <div className="text-[10px] uppercase tracking-wide text-mist">{data[hover].day}</div>
          <div className="font-display text-sm font-semibold text-ink">{ZAR(data[hover].total)}</div>
        </div>
      )}
    </div>
  )
}
