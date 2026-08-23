import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";

export default function TermsPage() {
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <p className="eyebrow">Terms of Service</p>
          <h1 className="mt-3 font-display text-4xl">Terms of use</h1>
          <p className="mt-4 text-sm text-dune">Last updated: August 2026</p>

          <div className="mt-8 space-y-8 text-dune">
            <TermsSection title="1. Acceptance of terms">
              <p>
                By creating an account or using LIMRA AI, you agree to these terms. If you do not
                agree, please do not use the platform.
              </p>
            </TermsSection>

            <TermsSection title="2. The service">
              <p>
                LIMRA AI provides informational tools, cost estimates, and a marketplace connecting
                you with independent third-party legal, accounting, and PRO service providers. We do
                not provide legal or tax advice ourselves, and estimates shown (including the setup
                calculator) are indicative only.
              </p>
            </TermsSection>

            <TermsSection title="3. Marketplace bookings">
              <p>
                When you submit a booking request, we forward your details to the selected
                independent expert. Any resulting engagement, pricing, and service quality is between
                you and that expert directly — LIMRA AI is not a party to that agreement.
              </p>
            </TermsSection>

            <TermsSection title="4. Your account">
              <p>
                You are responsible for keeping your login credentials secure and for the accuracy of
                information you submit.
              </p>
            </TermsSection>

            <TermsSection title="5. Changes">
              <p>We may update these terms from time to time. Continued use after changes constitutes acceptance.</p>
            </TermsSection>

            <TermsSection title="6. Contact">
              <p>
                Questions about these terms can be sent to <span className="text-linen">legal@limra.ai</span>.
              </p>
            </TermsSection>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl text-linen">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}
