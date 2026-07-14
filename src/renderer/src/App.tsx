import { IconProvider } from '@renderer/components/ui/Icon'
import { Gallery } from '@renderer/dev/Gallery'

function App(): React.JSX.Element {
  return (
    <IconProvider>
      <Gallery />
    </IconProvider>
  )
}

export default App
