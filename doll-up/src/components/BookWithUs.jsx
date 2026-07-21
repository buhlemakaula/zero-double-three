// Signature repeated-headline stack: "BOOK WITH US" repeated in decreasing
// opacity with a cut-out portrait sitting on top, leading into the flow.
export default function BookWithUs({ onBook }) {
  const opacities = [1, 0.5, 0.22, 0.1]
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper sm:py-32">
      <div className="shell relative">
        {/* Repeated headline */}
        <div aria-hidden="true" className="pointer-events-none select-none text-center">
          {opacities.map((o, i) => (
            <h2
              key={i}
              className="font-display text-[16vw] uppercase leading-[0.82] tracking-tight sm:text-[10rem]"
              style={{ opacity: o }}
            >
              Book with us
            </h2>
          ))}
        </div>

        {/* Portrait on top */}
        <img
          src="/photos/braids.jpg"
          alt="Doll Up Hair & Nail Art client with fresh knotless braids."
          className="absolute left-1/2 top-1/2 z-10 aspect-[3/4] w-40 -translate-x-1/2 -translate-y-1/2 rounded-[22px] object-cover object-top sm:w-56"
          loading="lazy"
        />
      </div>

      <div className="relative z-20 mt-14 text-center">
        <p className="mx-auto mb-6 max-w-md px-6 text-sm leading-relaxed text-paper/70">
          Pick a service, choose your date and time, and secure your slot with a
          deposit. You’ll get a WhatsApp confirmation straight to Doll Up.
        </p>
        <button className="pill bg-paper px-10 text-ink hover:bg-paper/85" onClick={onBook}>
          Start booking
        </button>
      </div>
    </section>
  )
}
