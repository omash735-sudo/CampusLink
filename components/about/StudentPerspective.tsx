// components/about/StudentPerspective.tsx

export function StudentPerspective() {
  return (
    <section className="py-16 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold mb-4">Built From a Student's Perspective</h2>
        <p className="text-muted-text text-lg mb-6">
          This project isn't being built from outside the university environment guessing what students need.
        </p>
        <div className="space-y-4">
          <div className="border border-gray-200 p-4 bg-off-white">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium bg-primary-green text-white px-3 py-1">1</span>
              <span className="text-sm">Student experience</span>
            </div>
          </div>
          <div className="border border-gray-200 p-4 bg-off-white">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium bg-primary-green text-white px-3 py-1">2</span>
              <span className="text-sm">Identify a problem</span>
            </div>
          </div>
          <div className="border border-gray-200 p-4 bg-off-white">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium bg-primary-green text-white px-3 py-1">3</span>
              <span className="text-sm">Build a solution</span>
            </div>
          </div>
          <div className="border border-gray-200 p-4 bg-off-white">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium bg-primary-green text-white px-3 py-1">4</span>
              <span className="text-sm">Students use it</span>
            </div>
          </div>
          <div className="border border-gray-200 p-4 bg-off-white">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium bg-primary-green text-white px-3 py-1">5</span>
              <span className="text-sm">Learn what works → Improve the platform</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-text mt-4 italic">
          This is an ongoing process of building, testing, and improving.
        </p>
      </div>
    </section>
  );
}
