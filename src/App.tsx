
import Timeline from './components/Timeline';
import { timelineItems } from './timelineItems';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Timeline Visualization</h1>
          <p className="text-gray-600">
            A responsive, interactive timeline component with space-efficient event layout
          </p>
        </header>
        
        <div className="mb-8 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">About This Timeline</h2>
          <p className="text-gray-600">
            This timeline displays events in a space-efficient manner where events that don't overlap in time can share the same horizontal lane.
            The timeline supports zooming, dragging to navigate, and inline editing of event names.
          </p>
        </div>
        
        <div className="h-[600px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <Timeline items={timelineItems} />
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Timeline Visualization Component • Made with React, TypeScript and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
