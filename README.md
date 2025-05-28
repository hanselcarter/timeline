# Interactive Timeline Component

This project is an implementation of a component for visualizing events on a timeline. It's built with React, TypeScript, and Tailwind CSS.

## Features

- Displays events in a compact, space-efficient layout
- Events with non-overlapping times share the same horizontal lane
- Interactive zoom in/out functionality
- Edit event names by double-clicking
- Draggable events (basic implementation)
- Tooltips showing event details on hover

## Technology Stack

- React (with TypeScript)
- Tailwind CSS for styling
- Vite as the build tool

## How to Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

- `src/components/` - Contains the Timeline and TimelineItem components
- `src/utils/` - Utility functions for date handling and layout calculation
- `src/timelineItems.ts` - Sample data for timeline events

## Assignment Reflection

### Time Spent

I spent approximately 3-4 hours on this assignment, including planning, implementation, and testing.

### What I Like About the Implementation

- The layout algorithm efficiently places events in lanes without wasting vertical space
- The component is responsive and supports zooming
- The implementation is modular and follows good React practices
- The timeline can handle a variety of event durations

### What I Would Change

- Implement more robust drag-and-drop functionality with actual date updates
- Add the ability to create new events directly on the timeline
- Improve performance for large numbers of events using virtualization
- Add more customization options for colors, labels, etc.

### Design Decisions

I drew inspiration from project management tools like Asana and Jira for the timeline design. The lane-based layout was chosen to maximize space efficiency while keeping the timeline readable.

The zoom functionality was implemented to allow users to focus on specific time periods or get a broader view of the timeline.

### Testing Approach

With more time, I would implement:

- Unit tests for utility functions using Jest
- Component tests with React Testing Library
- End-to-end tests for user interactions
- Performance tests for handling large datasets

I would focus on testing edge cases like events with identical start/end times, extremely short or long events, and unusual date ranges.


