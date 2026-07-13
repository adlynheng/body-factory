# `features/` — composed, domain components

Screens and domain components assembled from `components/ui/` primitives
(e.g. the calendar, session detail, sidebar, weekly template).

Each feature gets its own folder; a feature may hold multiple components plus
its own hooks and store slices. Keep primitives out of here — those belong in
`components/ui/`.
