export const metadata = {
  title: 'Proposal - Employee Monitoring',
};

export default function ProposalPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-4 text-4xl font-bold text-center">
        Time Management System <br /> (TMS) Employee <br />
        Monitoring — Proposal
      </h1>

      <p className="mb-8 text-lg text-muted-foreground">
        Automating attendance sheets monitoring — every cut-off, without the
        manual hassle.
      </p>

      {/* Introduction */}
      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold">Background</h2>
        <p>
          Every cut-off period, employees are required to manually transfer data
          from official attendance records into monitoring or attendance sheets.
          This process is repetitive, time-consuming, and prone to errors.
        </p>
        <p>
          The Employee Monitoring was built to eliminate this manual work by
          automating data extraction, work log generation, and document
          preparation — while still allowing full user control.
        </p>
      </section>

      {/* Problem */}
      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold">The Problem</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Manual copying of time-in, breaks, and time-out data every cut-off
          </li>
          <li>
            Rewriting the same information across multiple rows and documents
          </li>
          <li>
            Repeatedly drawing or signing signatures per row or per document
          </li>
          <li>Time spent on clerical work instead of productive tasks</li>
        </ul>
      </section>

      {/* Solution */}
      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold">Proposed Solution</h2>
        <p>
          The Employee Monitoring system provides a centralized, secure web
          application that automates the most tedious parts of attendance
          reporting.
        </p>

        <ul className="list-disc space-y-2 pl-6">
          <li>
            Upload official attendance PDF reports and automatically extract
            data
          </li>
          <li>
            Auto-generate work logs that can still be reviewed and edited by
            users
          </li>
          <li>
            Capture a digital signature once and reuse it across future
            documents
          </li>
          <li>Generate clean, readable, and printable attendance sheets</li>
          <li>
            Secure user authentication ensures data is private and controlled
          </li>
        </ul>
      </section>

      {/* Key Benefits */}
      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold">Key Benefits</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Significant reduction in time spent per cut-off</li>
          <li>Cleaner and more readable attendance records</li>
          <li>Less repetitive writing and signing</li>
          <li>Reduced risk of clerical errors</li>
          <li>
            Easier review process for personnel who check submitted monitoring
          </li>
        </ul>
      </section>

      {/* Limitations */}
      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold">Known Limitations</h2>
        <p>
          To ensure transparency, the following limitations are important to
          note:
        </p>

        <ol className="list-decimal space-y-3 pl-6">
          <li>
            <strong>PDF Data Visibility</strong>
            <br />
            Attendance records are extracted exactly as they appear in the
            official company-generated PDF. Any records or logs that are hidden,
            omitted, or not shown in the PDF must be manually added by the user
            during the editing stage before saving and printing.
          </li>

          <li>
            <strong>AI Extraction Service Availability</strong>
            <br />
            The system uses the free-tier Gemini AI service for PDF data
            extraction. In cases where the service is temporarily unavailable
            (e.g., rate limits, service outages, or 503 errors), users may need
            to wait until the service becomes available again.
          </li>
        </ol>
      </section>

      {/* Security */}
      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold">Security and Access</h2>
        <p>
          Access to the system is restricted to authenticated users only. All
          data is stored securely, and the application is intended strictly for
          internal company use.
        </p>
      </section>

      {/* Conclusion */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Conclusion</h2>
        <p>
          The Employee Monitoring is a practical tool designed to improve
          efficiency, accuracy, and readability of attendance reporting.
        </p>
        <p>
          By automating repetitive tasks while preserving user control, the
          system helps employees focus on meaningful work — and makes attendance
          review easier for everyone involved.
        </p>
      </section>
    </main>
  );
}
