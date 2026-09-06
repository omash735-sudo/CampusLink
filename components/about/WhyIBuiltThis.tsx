// components/about/WhyIBuiltThis.tsx

export function WhyIBuiltThis() {
  return (
    <section className="py-16 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold mb-4">Why I Built This</h2>
        <div className="space-y-4 text-muted-text">
          <p>
            As a university student, I noticed how much information gets lost between WhatsApp groups, notice boards, 
            and conversations. Important announcements, academic resources, and opportunities exist — but finding them 
            can be difficult.
          </p>
          <p>
            I enjoy building things with technology and saw an opportunity to bring some of these experiences together 
            in one place. That's how this project began.
          </p>
          <p>
            What started as a small idea has grown into a larger platform that continues to develop based on what 
            students actually need.
          </p>
          <div className="border-l-4 border-primary-green pl-4 py-2 bg-off-white">
            <p className="text-sm italic">
              "I built this because I believed university life could be more connected and easier to navigate."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
