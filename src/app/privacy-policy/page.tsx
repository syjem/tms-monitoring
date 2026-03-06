export const metadata = {
  title: 'Privacy Policy - TMS Employee Monitoring',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>

      <section className="space-y-2">
        <p>
          The TMS Employee Monitoring application (“the App”) is an
          independently developed web application designed to assist with
          attendance tracking, work log management, and related documentation
          within an organizational environment.
        </p>

        <p>
          This Privacy Policy explains how information is collected, used, and
          protected when using the App.
        </p>

        <h2 className="mt-6 text-xl font-semibold">Information Collected</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Authentication Information:</strong> name, email address,
            and profile image (if provided through Google Sign-In).
          </li>
          <li>
            <strong>Work-Related Data:</strong> time records, break periods,
            destinations, remarks — the uploaded attendance PDF files.
          </li>
          <li>
            <strong>Signature Data:</strong> digitally captured signatures used
            for the Attendance Sheet Monitoring.
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">How Information Is Used</h2>
        <p>
          Collected information is used solely to authenticate users, generate
          and manage attendance records, support work log workflows, and produce
          printable documentation.
        </p>

        <p>
          The App does <strong>not</strong> use personal data for advertising,
          tracking, or analytics purposes.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          Data Storage and Security
        </h2>
        <p>
          Data is stored using Supabase (PostgreSQL). Authentication is handled
          via Supabase and trusted third-party identity providers such as
          Google. Reasonable technical safeguards are applied to protect user
          information.
        </p>

        <h2 className="mt-6 text-xl font-semibold">Data Sharing</h2>
        <p>
          The App does not sell, rent, or share user data with third parties.
        </p>

        <h2 className="mt-6 text-xl font-semibold">Cookies and Sessions</h2>
        <p>
          Cookies are used strictly for authentication and session management.
          No advertising or tracking cookies are used.
        </p>

        <h2 className="mt-6 text-xl font-semibold">User Access and Control</h2>
        <p>
          Access to the App is restricted to authorized users. Users may review
          and modify their own data within the application where permitted.
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          Changes to This Privacy Policy
        </h2>
        <p>
          This Privacy Policy may be updated as the App evolves. Updates will be
          reflected on this page.
        </p>

        <h2 className="mt-6 text-xl font-semibold">Contact</h2>
        <p>
          For questions or concerns regarding this Privacy Policy, please
          contact the developer.
        </p>
      </section>
    </main>
  );
}
