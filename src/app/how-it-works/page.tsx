export const metadata = {
  title: 'How It Works',
};

const steps = [
  {
    title: 'Sign in to your account',
    description:
      'Sign in using your google account to access your attendance monitoring dashboard.',
  },
  {
    title: 'Generate attendance PDF report from the official TMS system',
    description:
      'Use your TMS system to generate a PDF report of your attendance records for the desired period.',
  },
  {
    title: 'Upload your attendance PDF report',
    description: 'Upload the generated report to start the extraction process.',
  },
  {
    title: 'Extract time logs automatically',
    description:
      'The system sends the file for AI-assisted extraction and prepares rows for attendance monitoring.',
  },
  {
    title: 'Review and edit extracted records',
    description:
      'Verify time-in, break, time-out, destinations, and remarks, then correct anything that needs adjustment.',
  },
  {
    title: 'Apply signature and signatories',
    description:
      'Set your digital signature and assign signatories to keep the document format consistent.',
  },
  {
    title: 'Save and print your attendance sheet',
    description: 'Generate a clean attendance sheet, print or save as a PDF.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8 space-y-3 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">How It Works</h1>
        <p className="mx-auto max-w-3xl text-sm text-muted-foreground md:text-base">
          A quick walkthrough of the attendance monitoring flow, from PDF upload
          to printable output.
        </p>
      </header>

      <section aria-label="Video tutorial" className="mb-12">
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/40">
          <div className="flex h-full w-full items-center justify-center text-center">
            <video
              src="https://tahazkmt37.ufs.sh/f/o0HXiQKa0GfJ8CKzx3kHNCBGnXs1oJuUMx39P5hbyLEfRQZj"
              controls
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <section aria-label="Step-by-step guide" className="space-y-4">
        <h2 className="text-2xl font-semibold">Step-by-step Guide</h2>

        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-lg border bg-card p-4 text-card-foreground"
            >
              <p className="text-sm font-semibold text-primary">
                Step {index + 1}
              </p>
              <h3 className="mt-1 text-base font-semibold md:text-lg">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
