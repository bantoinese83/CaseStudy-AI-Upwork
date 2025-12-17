import { ErrorBoundary } from './components/ErrorBoundary';
import { Chat } from './components/Chat';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <Chat />
      </div>
    </ErrorBoundary>
  );
}

export default App;
