export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <div className="shell grid items-center gap-12 md:grid-cols-2">
        {/* Portrait */}
        <div className="relative order-1 mx-auto w-full max-w-sm md:order-none md:max-w-md">
          <div className="absolute -inset-3 -z-0 rounded-[32px] bg-greige" />
          <img
            src="/photos/glam-white.jpg"
            alt="NZ Myeni, the makeup artist and wig installer behind Glammified by Kwannz."
            className="relative z-10 aspect-[4/5] w-full rounded-[26px] object-cover"
            loading="lazy"
          />
        </div>

        {/* Copy — small tracked label above a bold heading */}
        <div>
          <p className="label mb-3">Meet your</p>
          <h2 className="display-title text-5xl sm:text-6xl">
            Makeup
            <br />
            artist
          </h2>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/75">
            I’m <strong className="font-semibold">NZ&nbsp;Myeni</strong>, the
            hands behind Glammified by Kwannz. From my studio in Pietermaritzburg
            I do soft-glam beats and clean wig installs for graduations,
            shoots, weddings and everyday self-love. Every face gets the same
            care: skin that glows, lashes that flutter, and a finish that lasts
            all day.
          </p>

          <p className="mt-8 font-serif text-3xl italic text-ink/80">
            Let your face be my canvas.
          </p>
          <p className="mt-2 label">Kwannz</p>
        </div>
      </div>
    </section>
  )
}
