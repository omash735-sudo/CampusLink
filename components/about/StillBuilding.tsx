// components/about/StillBuilding.tsx

export function StillBuilding() {
  return (
    <section className="py-16 border-b border-gray-200 bg-off-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-4">Still Building</h2>
        <p className="text-lg text-muted-text">
          This is an evolving project. Features are continuously being developed, tested, 
          refined, and improved based on what students actually need.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="text-xs bg-white border border-gray-200 px-4 py-2">Building</span>
          <span className="text-xs bg-white border border-gray-200 px-4 py-2">Testing</span>
          <span className="text-xs bg-white border border-gray-200 px-4 py-2">Refining</span>
          <span className="text-xs bg-white border border-gray-200 px-4 py-2">Improving</span>
        </div>
      </div>
    </section>
  );
}
