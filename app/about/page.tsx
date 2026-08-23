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
              LIMRA AI exists to remove the guesswork from launching and operating a business in the
              Kingdom. Regulatory requirements, licensing steps, and localization targets change
              often — we track them so founders don&apos;t have to.
            </p>
            <p>
              We combine live regulatory intelligence with a vetted marketplace of legal, accounting,
              and PRO specialists, and a command dashboard that keeps every license, filing, and
              obligation visible in one place — from your first application through ongoing
              compliance.
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
