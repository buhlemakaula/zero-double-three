export default function Hero({ onBook }) {
  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-6 sm:pt-10">
      <div className="shell grid items-center gap-8 pb-4 md:grid-cols-[1.05fr_0.95fr]">
        {/* Left — mixed-weight serif/display headline */}
        <div className="animate-fade-up">
          <p className="label mb-5">Pietermaritzburg · KZN</p>
          <h1 className="font-serif text-[15vw] font-light leading-[0.92] tracking-[-0.01em] sm:text-7xl md:text-[5.4rem]">
            Let your
            <br />
            <span className="italic">face be</span>
            <br />
            <span className="font-display text-[16vw] not-italic uppercase leading-[0.8] tracking-tight sm:text-[6.2rem] md:text-[6.6rem]">
              my canvas
            </span>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">
            Makeup artistry and wig installations by NZ&nbsp;Myeni. Soft glam,
            clean installs, and a beat that lasts — booked online in a few taps.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="pill pill-solid px-8" onClick={onBook}>
              Book now
            </button>
            <a href="#services" className="pill pill-outline px-8">
              View services
            </a>
          </div>
        </div>

        {/* Right — portrait inside a greige frame */}
        <div className="relative mx-auto w-full max-w-sm md:max-w-none">
          <div className="absolute inset-x-6 top-8 -z-0 aspect-[3/4] rounded-[40%] bg-greige md:inset-x-10" />
          <img
            src="/photos/hero-leather.jpg"
            alt="Glammified by Kwannz client with a full soft-glam beat and a sleek straight install, in a black leather jacket."
            className="relative z-10 aspect-[4/5] w-full rounded-[28px] object-cover object-top shadow-[0_1px_0_rgba(10,10,10,0.06)]"
            loading="eager"
          />
        </div>
      </div>
    </section>
  )
}
