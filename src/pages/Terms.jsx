import { LEGAL } from "../lib/legal.js";

// General-purpose terms for a small, local-only tracking app. Have a lawyer review them
// before a commercial launch, and update them if the app gains accounts or payments.
export default function Terms() {
  return (
    <article className="legal">
      <p className="updated">Last updated {LEGAL.updated}</p>

      <section>
        <h2>Using Subscription Guard</h2>
        <p>
          These terms are an agreement between you and {LEGAL.name}. By creating an account or using the app you agree to them.
          If you do not agree, please do not use the app.
        </p>
      </section>

      <section>
        <h2>What the app does</h2>
        <p>
          Subscription Guard is a tool for keeping track of recurring charges you enter yourself, showing totals, and
          reminding you of upcoming dates. It does <b>not</b> cancel subscriptions, make payments, connect to your bank or
          contact any service on your behalf.
        </p>
      </section>

      <section>
        <h2>You are responsible for checking your charges</h2>
        <p>
          Everything the app shows is based on what you type in. Totals, dates and warnings are estimates. Billing dates can
          change, prices can rise, and a service may charge you in ways the app does not know about. Always confirm the real
          amount and date with the service, and keep your own records.
        </p>
        <p>
          A trial or renewal warning is a convenience, not a guarantee. If a warning is missing, late or wrong, you are still
          responsible for cancelling in time.
        </p>
      </section>

      <section>
        <h2>Cancel steps</h2>
        <p>
          Cancel steps in the app are either examples or notes you wrote yourself. Services change their menus, fees and
          cancellation rules. Follow the service's own instructions and terms, and check what it says about refunds and
          early-termination fees.
        </p>
      </section>

      <section>
        <h2>Not financial advice</h2>
        <p>The app gives general information only. It is not financial, legal or tax advice.</p>
      </section>

      <section>
        <h2>Your data and your device</h2>
        <p>
          Your information is stored in your browser on your device (see the Privacy Policy). There is no backup. If you clear
          your browser data, sign out, switch devices or lose the device, the information is gone and we cannot restore it.
          Write down anything you cannot afford to lose.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>
          Use the app lawfully and do not try to disrupt it, break it or use it to harm others. You are responsible for
          anything you enter.
        </p>
      </section>

      <section>
        <h2>Third-party names</h2>
        <p>
          Names such as Netflix, Spotify or Adobe appear as examples only. They belong to their owners, and {LEGAL.name} is not
          affiliated with or endorsed by them.
        </p>
      </section>

      <section>
        <h2>No warranty</h2>
        <p>
          The app is provided "as is" and "as available", without promises that it will be accurate, uninterrupted or free of
          errors. It is an early version and may change or stop working.
        </p>
      </section>

      <section>
        <h2>Limit of liability</h2>
        <p>
          To the fullest extent the law allows, {LEGAL.name} is not liable for any indirect or consequential loss, or for
          charges, fees, missed cancellations or lost data that result from using or relying on the app. Nothing in these terms
          limits any right or liability that cannot legally be limited.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          We may update the app or these terms. The date at the top shows the latest version. If you keep using the app after
          a change, you accept the updated terms.
        </p>
      </section>

      {LEGAL.law && (
        <section>
          <h2>Governing law</h2>
          <p>These terms are governed by the laws of {LEGAL.law}.</p>
        </section>
      )}

      <section>
        <h2>Contact</h2>
        {LEGAL.email ? (
          <p>Questions about these terms: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.</p>
        ) : (
          <p>For questions about these terms, contact the person or business that runs this site.</p>
        )}
      </section>
    </article>
  );
}
