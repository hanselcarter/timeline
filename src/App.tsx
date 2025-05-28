
import Timeline from './components/Timeline';
import { timelineItems } from './timelineItems';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      
      <section className="w-full py-16 px-4 flex flex-col items-center text-center bg-gradient-to-br from-blue-100 to-white">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4 tracking-tight drop-shadow-lg">Meet the Interactive Timeline</h1>
        <p className="text-xl text-blue-700 mb-8 max-w-2xl">A modern, responsive, and interactive timeline visualization for your events. Built for clarity, speed, and delight.</p>
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full shadow text-sm font-semibold">Drag &amp; Drop Events</span>
          <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full shadow text-sm font-semibold">Zoom &amp; Pan</span>
          <span className="inline-block bg-blue-400 text-white px-4 py-2 rounded-full shadow text-sm font-semibold">Inline Editing</span>
          <span className="inline-block bg-blue-300 text-blue-900 px-4 py-2 rounded-full shadow text-sm font-semibold">Space-Efficient Layout</span>
        </div>
        <div className="mt-8 animate-bounce">
          <span className="text-blue-400 font-bold">↓</span>
        </div>
      </section>

      
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-blue-500">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Effortless Drag &amp; Drop</h3>
          <p className="text-gray-600">Move events on the timeline with smooth, precise drag-and-drop. No accidental shifts—just pure control.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-blue-400">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Smart Zoom &amp; Pan</h3>
          <p className="text-gray-600">Zoom in for detail or out for the big picture. Seamless panning lets you explore your timeline with ease.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-blue-300">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Inline Editing</h3>
          <p className="text-gray-600">Double-click any event to edit its name instantly—no popups, no fuss. Just click, type, and save.</p>
        </div>
      </section>

      
      <section className="max-w-6xl mx-auto w-full px-4 pb-12">
        <div className="h-[600px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <Timeline items={timelineItems} />
        </div>
      </section>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Timeline Visualization Component • Made with React, TypeScript and Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;
