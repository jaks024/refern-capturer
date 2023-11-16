import { Dashboard } from './features/dashboard/Dashboard';
import './assets/index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './libs/reactQuery';
import { AuthProvider } from './features/auth/AuthProvider';

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
