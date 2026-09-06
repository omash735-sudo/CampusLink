// components/about/WhatMakesDifferent.tsx

export function WhatMakesDifferent() {
  return (
    <section className="py-16 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center">What Makes the Project Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-2">Student-Centred</h3>
            <p className="text-muted-text text-sm">
              The platform is being developed around actual student experiences.
            </p>
          </div>
          <div className="border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-2">Connected</h3>
            <p className="text-muted-text text-sm">
              Different parts of campus life are designed to work together.
            </p>
          </div>
          <div className="border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-2">Accessible</h3>
            <p className="text-muted-text text-sm">
              Important information should be easier for students to find.
            </p>
          </div>
          <div className="border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-2">Continuously Evolving</h3>
            <p className="text-muted-text text-sm">
              The platform is a developing project rather than a finished product.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
