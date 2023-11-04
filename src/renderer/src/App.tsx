import { Dashboard } from './features/dashboard/Dashboard'
import './assets/index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './libs/reactQuery'

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  )
}

export default App
