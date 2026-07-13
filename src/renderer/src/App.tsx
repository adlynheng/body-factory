function App(): React.JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="rounded-card border border-border-subtle bg-surface-card px-8 py-6 shadow-window">
        <p className="text-2xs font-bold uppercase tracking-widest text-text-tertiary">Body Factory</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-text-primary">
          Design system ready
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Tokens, Tailwind, and the component structure are wired up. Views come next.
        </p>
      </div>
    </div>
  )
}

export default App
