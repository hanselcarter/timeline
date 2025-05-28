export interface TimelineItem {
  id: string;
  name: string;
  startDate: string; // Format: YYYY-MM-DD
  endDate: string; // Format: YYYY-MM-DD
}

export const timelineItems: TimelineItem[] = [
  {
    id: "1",
    name: "Plan",
    startDate: "2024-01-01",
    endDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Research",
    startDate: "2024-01-10",
    endDate: "2024-01-30",
  },
  {
    id: "3",
    name: "Development",
    startDate: "2024-02-01",
    endDate: "2024-02-25",
  },
  {
    id: "4",
    name: "Testing",
    startDate: "2024-02-20",
    endDate: "2024-03-05",
  },
  {
    id: "5",
    name: "Review",
    startDate: "2024-03-01",
    endDate: "2024-03-15",
  },
];
