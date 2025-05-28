import React, { useState, useEffect, useRef } from "react";
import type { TimelineItem as TimelineItemType } from "../timelineItems";
import {
  getEarliestDate,
  getLatestDate,
  addDays,
  formatDate,
} from "../utils/dateUtils";
import { calculateLayout } from "../utils/layoutUtils";
import TimelineItem from "./TimelineItem";

interface TimelineProps {
  items: TimelineItemType[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const [timelineItems, setTimelineItems] = useState<TimelineItemType[]>(items);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [timeRange, setTimeRange] = useState({
    startDate: "",
    endDate: "",
  });

  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (items.length > 0) {
      const startDate = getEarliestDate(items);
      const paddedStartDate = addDays(startDate, -7);

      const endDate = getLatestDate(items);
      const paddedEndDate = addDays(endDate, 7);

      setTimeRange({
        startDate: paddedStartDate,
        endDate: paddedEndDate,
      });
    }
  }, [items]);

  const zoomLevels = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5];

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.findIndex((level) => level >= zoomLevel);
    const nextIndex = Math.min(currentIndex + 1, zoomLevels.length - 1);
    setZoomLevel(zoomLevels[nextIndex]);
  };

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.findIndex((level) => level >= zoomLevel);
    const prevIndex = Math.max(currentIndex - 1, 0); // Don't go below the minimum
    setZoomLevel(zoomLevels[prevIndex]);
  };

  const handleUpdateItem = (updatedItem: TimelineItemType) => {
    console.log("Timeline received updated item:", updatedItem);

    setTimelineItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );

    if (editingItemId === updatedItem.id) {
      setEditingItemId(null);
    }
  };

  const handleStartEditing = (id: string) => {
    setEditingItemId(id);
  };

  const totalDays =
    new Date(timeRange.endDate).getTime() -
    new Date(timeRange.startDate).getTime();
  const daysCount = Math.ceil(totalDays / (1000 * 60 * 60 * 24));

  const dateMarkers = [];
  const markerInterval = zoomLevel > 2 ? 1 : zoomLevel > 1 ? 7 : 14;

  for (let i = 0; i <= daysCount; i += markerInterval) {
    const date = new Date(timeRange.startDate);
    date.setDate(date.getDate() + i);
    const left = (i / daysCount) * 100;

    dateMarkers.push({
      date: formatDate(date),
      left,
    });
  }

  const positionedItems = calculateLayout(
    timelineItems,
    timeRange.startDate,
    timeRange.endDate,
    zoomLevel
  );

  const laneHeight = 40;
  const lanes =
    positionedItems.length > 0
      ? Math.max(...positionedItems.map((item) => item.lane)) + 1
      : 1;

  const containerHeight = lanes * laneHeight;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editingItemId) return;

    setIsDragging(true);
    setDragStartX(e.clientX);

    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }

    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartX;

    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - deltaX;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <div className="text-xl font-bold text-gray-800">
          Interactive Timeline
        </div>
        <div className="timeline-controls">
          <button
            onClick={handleZoomOut}
            className="timeline-control-btn"
            title="Zoom out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="text-sm font-medium text-gray-700">
            {Math.round(zoomLevel * 100)}%
          </div>
          <button
            onClick={handleZoomIn}
            className="timeline-control-btn"
            title="Zoom in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
        <p>
          Double-click any event to edit its name. Drag to navigate the
          timeline.
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-x-auto p-4"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div
          ref={timelineRef}
          className="relative timeline"
          style={{
            width: `${100 * zoomLevel}%`,
            height: `${containerHeight + 60}px`,
            minWidth: "100%",
            paddingRight: "20px",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="h-12 relative mb-6 border-b border-gray-200">
            {dateMarkers.map((marker, index) => (
              <div
                key={index}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${marker.left}%` }}
              >
                <div className="h-3 w-px bg-gray-300"></div>
                <div className="text-xs font-medium text-gray-700 mt-1 bg-white px-2 py-1 rounded-full shadow-sm border border-gray-200 whitespace-nowrap">
                  {marker.date}
                </div>
              </div>
            ))}
          </div>

          <div className="relative" style={{ height: `${containerHeight}px` }}>
            {Array.from({ length: lanes }).map((_, index) => (
              <div
                key={index}
                className={`absolute w-full ${
                  index % 2 === 0 ? "bg-gray-50" : ""
                } border-b border-gray-100`}
                style={{
                  top: `${index * laneHeight}px`,
                  height: `${laneHeight}px`,
                }}
              ></div>
            ))}

            {positionedItems.map((item) => (
              <TimelineItem
                key={item.id}
                item={item}
                laneHeight={laneHeight}
                onUpdateItem={handleUpdateItem}
                isEditing={editingItemId === item.id}
                onStartEditing={handleStartEditing}
                timeRange={timeRange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
