import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { IconProvider } from '@renderer/components/ui/Icon'
import { TooltipProvider } from '@renderer/components/ui/Tooltip'
import { Gallery } from '@renderer/dev/Gallery'
import {
  CalendarPage,
  OverviewPage,
  RootLayout,
  SessionPage,
  SettingsPage,
  TemplatePage,
  TrendsPage
} from '@renderer/routes'

/**
 * App — the router host. Pages are split by route under a shared `RootLayout`
 * (titlebar + sidebar + global modals); `HashRouter` is used because the built
 * app is served over `file://`, where path-based routing can't reload/deep-link.
 * All shared state lives in the zustand `appStore`, so pages are thin adapters.
 */
function App(): React.JSX.Element {
  return (
    <IconProvider>
      <TooltipProvider>
        <HashRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="weekly-template" element={<TemplatePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="session/:sessionId" element={<SessionPage />} />
              <Route path="trends" element={<TrendsPage />} />
            </Route>
            {/* Dev-only primitive gallery (was the #gallery hash before routing). */}
            <Route path="gallery" element={<Gallery />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </IconProvider>
  )
}

export default App
