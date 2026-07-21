// Slim progress indicator across the top of the booking flow.
export default function Stepper({ steps, current }) {
  return (
    <div className="border-b hairline bg-paper">
      <div className="shell max-w-2xl py-4">
        <div className="flex items-center gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-1.5">
              <span
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= current ? 'bg-ink' : 'bg-ink/15'
                }`}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
          Step {Math.min(current + 1, steps.length)} of {steps.length} · {steps[Math.min(current, steps.length - 1)]}
        </p>
      </div>
    </div>
  )
}
