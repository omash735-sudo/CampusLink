// components/about/WhereItStarted.tsx

export function WhereItStarted() {
  return (
    <section className="py-16 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold mb-8">Where It Started</h2>
        <div className="space-y-6">
          <div className="border-l-4 border-primary-green pl-4">
            <h3 className="font-bold">The Idea</h3>
            <p className="text-sm text-muted-text">The initial concept — building something useful for students.</p>
          </div>
          <div className="border-l-4 border-primary-green pl-4">
            <h3 className="font-bold">The Experiment</h3>
            <p className="text-sm text-muted-text">Building the first version and testing what was possible.</p>
          </div>
          <div className="border-l-4 border-primary-green pl-4">
            <h3 className="font-bold">The Platform</h3>
            <p className="text-sm text-muted-text">Expanding the idea into multiple areas of campus life.</p>
          </div>
          <div className="border-l-4 border-primary-green pl-4">
            <h3 className="font-bold">Today</h3>
            <p className="text-sm text-muted-text">Continuing to build, test, and improve the platform.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
