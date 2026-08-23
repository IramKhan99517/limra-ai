import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";

export default function PrivacyPage() {
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <p className="eyebrow">Privacy Policy</p>
          <h1 className="mt-3 font-display text-4xl">How we handle your data</h1>
          <p className="mt-4 text-sm text-dune">Last updated: August 2026</p>

          <div className="mt-8 space-y-8 text-dune">
            <PolicySection title="1. Who we are">
              <p>
                LIMRA AI (&quot;we&quot;, &quot;us&quot;) provides a business-setup intelligence
                platform and marketplace for founders operating in or entering the Kingdom of Saudi
                Arabia. This policy explains what personal data we collect, why, and the choices you
                have.
              </p>
            </PolicySection>

            <PolicySection title="2. Data we collect">
              <p>
                Account details you provide (name, email, password), company and licensing
                information you enter into the platform, and booking requests you submit to
                marketplace experts (name, email, preferred date, message).
              </p>
            </PolicySection>

            <PolicySection title="3. How we use it">
              <p>
                To operate your account and dashboard, connect you with marketplace experts you
                request, and keep you informed of relevant licensing or compliance deadlines. We do
                not sell personal data to third parties.
              </p>
            </PolicySection>

            <PolicySection title="4. Your rights under Saudi PDPL">
              <p>
                In accordance with the Kingdom&apos;s Personal Data Protection Law (PDPL), you have
                the right to access, correct, or request deletion of your personal data, and to
                withdraw consent to processing at any time. Requests can be made by contacting us
                using the details below.
              </p>
            </PolicySection>

            <PolicySection title="5. Data storage">
              <p>
                Your data is stored with our infrastructure providers and protected using
                industry-standard security practices, including encryption in transit.
              </p>
            </PolicySection>

            <PolicySection title="6. Contact">
              <p>
                For any privacy-related request, contact us at{" "}
                <span className="text-linen">privacy@limra.ai</span>.
              </p>
            </PolicySection>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl text-linen">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}
