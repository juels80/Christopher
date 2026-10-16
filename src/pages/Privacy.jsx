import { LEGAL } from "../lib/legal.js";

// Plain-language policy that matches what the app does today: everything stays in the
// browser. If you add real accounts, sync, analytics or bank connections, rewrite this first.
export default function Privacy() {
  return (
    <article className="legal">
      <p className="updated">Last updated {LEGAL.updated}</p>

      <section>
        <h2>The short version</h2>
        <p>
          The app keeps your information on your own device. {LEGAL.name} does not run a server that receives
          your charges, your name or your sign-up details, and the app does not track you.
        </p>
      </section>

      <section>
        <h2>What the app handles</h2>
        <ul>
          <li><b>Your first name</b>, if you enter one when you sign up, so the app can greet you.</li>
          <li>
            <b>Your charges</b>: the service name, price, how often it bills, the next charge date, a category, whether it is a
            free trial, and any cancel steps you write down.
          </li>
          <li>
            <b>Email and password:</b> the sign-up form asks for them, but this version does not save them or send them anywhere.
            No account is created. Do not reuse an important password here.
          </li>
        </ul>
      </section>

      <section>
        <h2>Where it is stored</h2>
        <p>
          Your name and charges are saved in your browser's local storage on this device. They are not uploaded to us or to
          anyone else. Because of that, we cannot see them, recover them or move them to another device.
        </p>
      </section>

      <section>
        <h2>What we do not do</h2>
        <ul>
          <li>No advertising, analytics or tracking scripts.</li>
          <li>No cookies used for tracking.</li>
          <li>No selling or sharing of your information.</li>
          <li>No connection to your bank, card or any other account.</li>
          <li>No requests to third-party services. The fonts the app uses are bundled with it.</li>
        </ul>
      </section>

      <section>
        <h2>Hosting</h2>
        <p>
          The app is delivered over the internet by a hosting provider. Like most websites, that provider may keep standard
          technical logs, such as your IP address, the time and the page requested. The app does not add your name or your list of
          charges to those logs.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <ul>
          <li>Edit or delete any charge in the app at any time.</li>
          <li>Choose Sign out on the Home screen to remove your saved name and charges from this device.</li>
          <li>You can also clear this site's data in your browser settings.</li>
        </ul>
        <p>Because the data lives only on your device, deleting it there deletes it everywhere.</p>
      </section>

      <section>
        <h2>Children</h2>
        <p>The app is not directed to children under 13, and we do not knowingly collect information from children.</p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          If the app changes in a way that affects your information, for example by adding accounts, syncing or bank
          connections, we will update this policy first and tell you in the app before it takes effect.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        {LEGAL.email ? (
          <p>Questions about this policy: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.</p>
        ) : (
          <p>For questions about this policy, contact the person or business that runs this site.</p>
        )}
      </section>
    </article>
  );
}
