import type { TimelineItem } from '../timelineItems';
import { datesOverlap } from './dateUtils';

export interface PositionedItem extends TimelineItem {
  lane: number;  // The lane (row) where the item will be placed
  width: number; // Width in percentage based on date range
  left: number;  // Left position in percentage
}

export const calculateLayout = (
  items: TimelineItem[],
  startDate: string,
  endDate: string,
  zoomLevel: number = 1
): PositionedItem[] => {
    const totalTimespan = new Date(endDate).getTime() - new Date(startDate).getTime();
  
    const sortedItems = [...items].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
  const positionedItems: PositionedItem[] = [];
  const lanes: { endDate: string }[] = [];
  
  for (const item of sortedItems) {
        let laneIndex = 0;
    let placed = false;
    
    for (let i = 0; i < lanes.length; i++) {
      if (new Date(lanes[i].endDate) < new Date(item.startDate)) {
                lanes[i].endDate = item.endDate;
        laneIndex = i;
        placed = true;
        break;
      }
    }
    
        if (!placed) {
      lanes.push({ endDate: item.endDate });
      laneIndex = lanes.length - 1;
    }
    
        const itemStart = new Date(item.startDate).getTime();
    const itemEnd = new Date(item.endDate).getTime();
    const left = ((itemStart - new Date(startDate).getTime()) / totalTimespan) * 100;
    const width = ((itemEnd - itemStart) / totalTimespan) * 100 * zoomLevel;
    
        positionedItems.push({
      ...item,
      lane: laneIndex,
      width,
      left
    });
  }
  
  return positionedItems;
};

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
