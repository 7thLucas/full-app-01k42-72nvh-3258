export default function Homepage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">QuantumBytes Template</h1>
      <p className="text-gray-600 mb-6">
        Welcome to the QuantumBytes template homepage.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Module Structure</h2>
        <p className="mb-3">
          This project follows a strict module-based architecture. All new
          functionality must be created as modules in the{" "}
          <code className="bg-gray-100 px-1 rounded">src/modules/</code>{" "}
          directory.
        </p>
        <p>
          For detailed documentation on module structure and extension rules,
          see:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>
            <a
              className="text-blue-600 hover:underline"
              href="/docs/module-structure.md"
            >
              Module Structure Documentation
            </a>
          </li>
          <li>
            <a
              className="text-blue-600 hover:underline"
              href="/docs/module-rules.md"
            >
              Module Rules Quick Reference
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
