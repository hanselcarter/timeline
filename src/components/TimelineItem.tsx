import React, { useState, useRef, useEffect } from 'react';
import type { TimelineItem as TimelineItemType } from '../timelineItems';
import { formatDate } from '../utils/dateUtils';

interface TimelineItemProps {
  item: TimelineItemType & {
    lane: number;
    width: number;
    left: number;
  };
  laneHeight: number;
  onUpdateItem: (updatedItem: TimelineItemType) => void;
  isEditing: boolean;
  onStartEditing: (id: string) => void;
  timeRange: {
    startDate: string;
    endDate: string;
  };
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  laneHeight,
  onUpdateItem,
  isEditing,
  onStartEditing,
  timeRange
}) => {
  // State for editing the name
  const [editName, setEditName] = useState(item.name);
  
  // State for drag operations
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'resize-start' | 'resize-end' | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartLeft, setDragStartLeft] = useState(0);
  const [dragStartWidth, setDragStartWidth] = useState(0);
  
  // State for visual position during drag
  const [tempLeft, setTempLeft] = useState<number | null>(null);
  const [tempWidth, setTempWidth] = useState<number | null>(null);
  
  // State for tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Refs
  const itemRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  // Find the timeline container on mount
  useEffect(() => {
    if (itemRef.current) {
      const timeline = document.querySelector('.timeline') as HTMLDivElement;
      if (timeline) {
        containerRef.current = timeline;
      }
    }
  }, []);
  
  // Set up document event listeners for drag operations
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleDocumentMouseMove);
        document.removeEventListener('mouseup', handleDocumentMouseUp);
      };
    }
  }, [isDragging, dragType, dragStartX, dragStartLeft, dragStartWidth]);

  // Start drag operation
  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize-start' | 'resize-end' = 'move') => {
    if (isEditing) return;
    
    // Prevent the event from reaching the Timeline component
    e.stopPropagation();
    e.preventDefault();
    
    console.log(`Starting drag: ${type}`);
    
    // Set initial drag state
    setIsDragging(true);
    setDragType(type);
    setDragStartX(e.clientX);
    setDragStartLeft(item.left);
    setDragStartWidth(item.width);
    
    // Initialize temp position to current position
    setTempLeft(item.left);
    setTempWidth(item.width);
  };
  
  // Convert position percentage to date
  const percentToDate = (percent: number): string => {
    try {
      if (!timeRange.startDate || !timeRange.endDate) return item.startDate;
      
      const startMs = new Date(timeRange.startDate).getTime();
      const endMs = new Date(timeRange.endDate).getTime();
      const totalMs = endMs - startMs;
      
      // Calculate date based on percentage
      const dateMs = startMs + (percent / 100) * totalMs;
      const date = new Date(dateMs);
      
      return formatDate(date);
    } catch (err) {
      console.error('Error converting percent to date:', err);
      return item.startDate;
    }
  };
  
  // Handle mouse movement during drag
  const handleDocumentMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    // Calculate how far the mouse has moved as a percentage
    const containerWidth = containerRef.current.clientWidth;
    const deltaX = e.clientX - dragStartX;
    const deltaPercentage = (deltaX / containerWidth) * 100;
    
    // Update position based on drag type
    if (dragType === 'move') {
      // Move the entire item
      const newLeft = Math.max(0, Math.min(100 - dragStartWidth, dragStartLeft + deltaPercentage));
      setTempLeft(newLeft);
      
    } else if (dragType === 'resize-start') {
      // Resize from the left (start date)
      const maxResize = dragStartLeft + dragStartWidth - 5; // Ensure minimum width of 5%
      const newLeft = Math.max(0, Math.min(maxResize, dragStartLeft + deltaPercentage));
      const newWidth = dragStartLeft + dragStartWidth - newLeft;
      
      setTempLeft(newLeft);
      setTempWidth(newWidth);
      
    } else if (dragType === 'resize-end') {
      // Resize from the right (end date)
      const minWidth = 5; // Minimum width of 5%
      const newWidth = Math.max(minWidth, Math.min(100 - dragStartLeft, dragStartWidth + deltaPercentage));
      
      setTempWidth(newWidth);
    }
  };
  
  // Handle mouse up to complete drag operation
  const handleDocumentMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Drag operation completed');
    
    // Calculate new dates based on final position
    if (tempLeft !== null && tempWidth !== null) {
      let newStartDate = item.startDate;
      let newEndDate = item.endDate;
      
      if (dragType === 'move' || dragType === 'resize-start') {
        newStartDate = percentToDate(tempLeft);
      }
      
      if (dragType === 'move' || dragType === 'resize-end') {
        const endPosition = dragType === 'resize-end' 
          ? dragStartLeft + tempWidth 
          : tempLeft + tempWidth;
        newEndDate = percentToDate(endPosition);
      }
      
      console.log('New dates:', newStartDate, 'to', newEndDate);
      
      // Only update if dates have changed
      if (newStartDate !== item.startDate || newEndDate !== item.endDate) {
        onUpdateItem({
          ...item,
          startDate: newStartDate,
          endDate: newEndDate
        });
      }
    }
    
    // Reset drag state
    setIsDragging(false);
    setDragType(null);
    setTempLeft(null);
    setTempWidth(null);
  };

  // Direct mouse up handler for the item
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    // Use the native event with the document handler
    handleDocumentMouseUp(e.nativeEvent);
  };

  const handleSubmitEdit = () => {
    onUpdateItem({
      ...item,
      name: editName
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitEdit();
    }
  };

  // Generate a consistent color based on item name
  const getItemColor = (name: string): string => {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    
    // Map to one of our predefined colors
    const colorIndex = hash % 6;
    
    // Tailwind color classes
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-green-100 border-green-300 text-green-800',
      'bg-yellow-100 border-yellow-300 text-yellow-800',
      'bg-red-100 border-red-300 text-red-800',
      'bg-purple-100 border-purple-300 text-purple-800',
      'bg-indigo-100 border-indigo-300 text-indigo-800',
    ];
    
    return colors[colorIndex];
  };
  
  const itemColor = getItemColor(item.name);

  // Calculate actual position, using temp values during drag or default values
  const actualLeft = tempLeft !== null && isDragging ? tempLeft : item.left;
  const actualWidth = tempWidth !== null && isDragging ? tempWidth : item.width;
  
  return (
    <div
      ref={itemRef}
      style={{
        position: 'absolute',
        left: `${actualLeft}%`,
        width: `${actualWidth}%`,
        top: `${item.lane * laneHeight}px`,
        height: `${laneHeight - 4}px`,
        transition: isDragging ? 'none' : 'left 0.2s, width 0.2s',
        zIndex: isDragging ? 1000 : 'auto'
      }}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
      onMouseUp={handleMouseUp}
      onDoubleClick={() => onStartEditing(item.id)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`timeline-item rounded-md p-2 shadow border ${itemColor} 
        ${isEditing ? 'ring-2 ring-blue-400 z-10' : ''} 
        ${isDragging ? 'shadow-xl outline outline-2 outline-blue-500' : ''} 
        ${isDragging ? 'cursor-grabbing' : 'cursor-move'}`}
    >
      {/* Resize handle for start date */}
      <div 
        className="absolute top-0 left-0 w-4 h-full cursor-ew-resize z-10 hover:bg-white hover:bg-opacity-30"
        onMouseDown={(e) => handleMouseDown(e, 'resize-start')}
        onClick={(e) => e.stopPropagation()}
      ></div>
      
      {/* Resize handle for end date */}
      <div 
        className="absolute top-0 right-0 w-4 h-full cursor-ew-resize z-10 hover:bg-white hover:bg-opacity-30"
        onMouseDown={(e) => handleMouseDown(e, 'resize-end')}
        onClick={(e) => e.stopPropagation()}
      ></div>
      
      <div className="p-2 text-white h-full flex flex-col justify-between">
        <div className="timeline-date">
          {formatDate(new Date(item.startDate))}
        </div>
        
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSubmitEdit}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none border-b border-white text-white font-medium"
          />
        ) : (
          <div className="font-medium text-white truncate">{item.name}</div>
        )}
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 bg-gray-800 text-white p-2 rounded text-xs shadow-lg z-50 whitespace-nowrap">
          <div><strong>Start:</strong> {formatDate(new Date(item.startDate))}</div>
          <div><strong>End:</strong> {formatDate(new Date(item.endDate))}</div>
        </div>
      )}
    </div>
  );
};

export default TimelineItem;
