// components/about/TheProblem.tsx

export function TheProblem() {
  return (
    <section className="py-16 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold mb-4">University Life Can Be Difficult to Navigate</h2>
        <p className="text-muted-text text-lg mb-6">
          Important information can be spread across many places:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="border border-gray-200 p-3 text-center">
            <span className="text-sm">WhatsApp Groups</span>
          </div>
          <div className="border border-gray-200 p-3 text-center">
            <span className="text-sm">Notice Boards</span>
          </div>
          <div className="border border-gray-200 p-3 text-center">
            <span className="text-sm">Different Websites</span>
          </div>
          <div className="border border-gray-200 p-3 text-center">
            <span className="text-sm">Student Conversations</span>
          </div>
          <div className="border border-gray-200 p-3 text-center">
            <span className="text-sm">Social Media</span>
          </div>
          <div className="border border-gray-200 p-3 text-center">
            <span className="text-sm">PDFs & Documents</span>
          </div>
        </div>
        <div className="mt-6 p-4 border border-gray-200 bg-off-white">
          <p className="text-muted-text text-sm">
            This can make it difficult for students to know:{' '}
            <span className="block mt-2 font-medium">
              Where do I find this? Who can help me? What's happening? Where is that place?
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
