import type { TimelineItem } from '../timelineItems';
import { datesOverlap } from './dateUtils';

// Interface for an item with its calculated position
export interface PositionedItem extends TimelineItem {
  lane: number;  // The lane (row) where the item will be placed
  width: number; // Width in percentage based on date range
  left: number;  // Left position in percentage
}

/**
 * Calculate the optimal layout for timeline items
 * This algorithm assigns lanes to items in a space-efficient way
 * If event A ends before event B starts, they can share the same lane
 */
export const calculateLayout = (
  items: TimelineItem[],
  startDate: string,
  endDate: string,
  zoomLevel: number = 1
): PositionedItem[] => {
  // Calculate the total timespan in days
  const totalTimespan = new Date(endDate).getTime() - new Date(startDate).getTime();
  
  // Sort items by start date
  const sortedItems = [...items].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
  const positionedItems: PositionedItem[] = [];
  const lanes: { endDate: string }[] = [];
  
  for (const item of sortedItems) {
    // Find the first lane where this item can fit
    let laneIndex = 0;
    let placed = false;
    
    for (let i = 0; i < lanes.length; i++) {
      if (new Date(lanes[i].endDate) < new Date(item.startDate)) {
        // This lane is free, we can place the item here
        lanes[i].endDate = item.endDate;
        laneIndex = i;
        placed = true;
        break;
      }
    }
    
    // If we couldn't find a lane, create a new one
    if (!placed) {
      lanes.push({ endDate: item.endDate });
      laneIndex = lanes.length - 1;
    }
    
    // Calculate position and width as percentages
    const itemStart = new Date(item.startDate).getTime();
    const itemEnd = new Date(item.endDate).getTime();
    const left = ((itemStart - new Date(startDate).getTime()) / totalTimespan) * 100;
    const width = ((itemEnd - itemStart) / totalTimespan) * 100 * zoomLevel;
    
    // Add the positioned item
    positionedItems.push({
      ...item,
      lane: laneIndex,
      width,
      left
    });
  }
  
  return positionedItems;
};

/**
 * Check if an item would overlap with any items in a lane
 */
export const wouldOverlap = (
  item: TimelineItem,
  lane: TimelineItem[]
): boolean => {
  return lane.some(existingItem => 
    datesOverlap(
      item.startDate, 
      item.endDate, 
      existingItem.startDate, 
      existingItem.endDate
    )
  );
};
