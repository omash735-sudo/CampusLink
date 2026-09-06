// components/about/WhereWeAreGoing.tsx

export function WhereWeAreGoing() {
  return (
    <section className="py-16 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold mb-4">Where We're Going</h2>
        <p className="text-muted-text mb-6">
          The long-term vision includes:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-gray-200 p-3">
            <span className="text-sm">A richer student community</span>
          </div>
          <div className="border border-gray-200 p-3">
            <span className="text-sm">Better campus discovery</span>
          </div>
          <div className="border border-gray-200 p-3">
            <span className="text-sm">Stronger academic support</span>
          </div>
          <div className="border border-gray-200 p-3">
            <span className="text-sm">More mentorship opportunities</span>
          </div>
          <div className="border border-gray-200 p-3">
            <span className="text-sm">Better access to campus information</span>
          </div>
          <div className="border border-gray-200 p-3">
            <span className="text-sm">More useful digital campus services</span>
          </div>
        </div>
      </div>
    </section>
  );
}
