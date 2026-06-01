import "./globals.css";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="mx-auto max-w-4xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#c8a96b]">
          Digiver Foundation
        </p>

        <h1
          className="mb-6 text-5xl md:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Enter the Digital Civilization
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
          The global application shell is active. Typography, theme
          infrastructure, metadata, providers, and immersive visual foundations
          have been successfully initialized.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
            <p className="text-sm text-gray-400">Theme System</p>
            <p className="font-medium text-white">Ready</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
            <p className="text-sm text-gray-400">Providers</p>
            <p className="font-medium text-white">Ready</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
            <p className="text-sm text-gray-400">App Shell</p>
            <p className="font-medium text-white">Ready</p>
          </div>
        </div>
        <div className="shadow-atmospheric">
          Theme Test
        </div>
      </section>
    </main>
  );
}