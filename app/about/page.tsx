import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";

export default function AboutPage() {
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1 className="mt-3 font-display text-4xl">Building clarity for Saudi Arabia&apos;s founders</h1>
          <div className="mt-8 space-y-5 text-dune">
            <p>
              LIMRA AI exists to remove the guesswork from launching a business in the Kingdom.
              Describe your business and we map it to the exact Saudi licenses and documents you
              need, then give you a clear, step-by-step setup roadmap.
            </p>
            <p>
              Today the platform maps your requirements across Saudi authorities, generates a
              personalized checklist, and keeps every document in one secure vault. Live regulatory
              monitoring, a vetted specialist marketplace, and deeper automation are on our roadmap
              as we integrate each authority.
            </p>
            <p>
              LIMRA AI is built in support of Saudi Arabia&apos;s Vision 2030 goals, helping both local
              and foreign founders establish compliant, well-structured businesses across the
              Kingdom&apos;s economic zones.
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
