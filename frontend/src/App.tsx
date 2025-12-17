import { ErrorBoundary } from './components/ErrorBoundary';
import { Chat } from './components/Chat';
import { Footer } from './components/Footer';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-void py-8 pb-16">
        <Chat />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
