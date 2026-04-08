export const metadata = {
  title: 'Terms of Service - Employee Monitoring',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Acceptance of Terms</h2>
        <p>
          By accessing or using the Employee Monitoring application (“the App”),
          you agree to these Terms of Service. If you do not agree, do not use
          the App.
        </p>

        <h2 className="text-xl font-semibold">Purpose of the App</h2>
        <p>
          The App is intended for internal use within an organizational
          environment to manage attendance records, process uploaded reports,
          and maintain work logs.
        </p>

        <h2 className="text-xl font-semibold">User Responsibilities</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Provide accurate attendance records from the official company
            website
          </li>
          <li>Use the App only for its intended business purpose</li>
          <li>Not attempt to misuse, disrupt, or reverse-engineer the App</li>
        </ul>

        <h2 className="text-xl font-semibold">Access and Availability</h2>
        <p>
          Access to the App may be modified or revoked at any time. The App is
          provided “as is” and may be updated or temporarily unavailable due to
          maintenance.
        </p>

        <h2 className="text-xl font-semibold">Data Accuracy</h2>
        <p>
          While the App automates data extraction and processing, users are
          responsible for reviewing generated records for accuracy.
        </p>

        <h2 className="text-xl font-semibold">Intellectual Property</h2>
        <p>
          The Employee Monitoring application was independently developed by the
          author. All source code, system logic, and related intellectual
          property remain the property of the developer, unless explicitly
          transferred or licensed through a separate written agreement.
        </p>
        <p>
          Any evaluation, use, or deployment of the system by the company shall
          be subject to mutually agreed terms.
        </p>

        <h2 className="text-xl font-semibold">Limitation of Liability</h2>
        <p>
          The App is provided as an internal productivity tool by the developer.
          The developer shall not be liable for damages resulting from incorrect
          data, uploaded files, or user misuse.
        </p>

        <h2 className="text-xl font-semibold">Changes to Terms</h2>
        <p>
          These Terms may be updated periodically. Continued use of the App
          constitutes acceptance of the updated Terms.
        </p>

        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          For questions, feedback, or discussions regarding this application,
          please contact the developer.
        </p>
      </section>
    </main>
  );
}
