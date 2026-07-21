export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <div className="shell grid items-center gap-12 md:grid-cols-2">
        {/* Portrait */}
        <div className="relative order-1 mx-auto w-full max-w-sm md:order-none md:max-w-md">
          <div className="absolute -inset-3 -z-0 rounded-[32px] bg-greige" />
          <img
            src="/photos/about.jpg"
            alt="Inside Doll Up Hair & Nail Art in Pietermaritzburg."
            className="relative z-10 aspect-[4/5] w-full rounded-[26px] object-cover"
            loading="lazy"
          />
        </div>

        {/* Copy — small tracked label above a bold heading */}
        <div>
          <p className="label mb-3">Welcome to</p>
          <h2 className="display-title text-5xl sm:text-6xl">
            Doll Up
            <br />
            studio
          </h2>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/75">
            <strong className="font-semibold">Doll Up Hair &amp; Nail Art</strong> is a
            hair and nail studio in Pietermaritzburg. From knotless braids and neat
            cornrows to gel sets and custom nail art, we do it for the whole family,
            little ones included. Gentle hands, clean work, and a look you will love
            to wear.
          </p>

          <p className="mt-8 font-serif text-3xl italic text-ink/80">
            Own Your Crown.
          </p>
          <p className="mt-2 label">Doll Up Hair &amp; Nail Art</p>
        </div>
      </div>
    </section>
  )
}
