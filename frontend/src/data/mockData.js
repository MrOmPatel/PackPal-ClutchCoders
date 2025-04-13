let mockDataState = {
  trips: [
    {
      id: 1,
      title: "Summer Camping Trip",
      startDate: "2024-07-15",
      endDate: "2024-07-17",
      location: "Yosemite National Park",
      participants: 12,
      status: "Active",
      items: [
        { name: "Tent", assignedTo: "John", status: "Packed" },
        { name: "Sleeping Bags", assignedTo: "Sarah", status: "Pending" },
        { name: "Cooking Equipment", assignedTo: "Mike", status: "Packed" },
      ]
    },
    {
      id: 2,
      title: "Company Retreat",
      startDate: "2024-08-05",
      endDate: "2024-08-07",
      location: "Lake Tahoe Resort",
      participants: 25,
      status: "Planning",
      items: [
        { name: "Laptop", assignedTo: "Everyone", status: "Pending" },
        { name: "Presentation Materials", assignedTo: "Team Leads", status: "Not Started" },
      ]
    }
  ],
  events: [
    {
      id: 3,
      title: "Team Building Workshop",
      startDate: "2024-09-10",
      endDate: "2024-09-10",
      location: "Downtown Conference Center",
      participants: 15,
      status: "Planning",
      items: [
        { name: "Name Tags", assignedTo: "HR Team", status: "Not Started" },
        { name: "Activity Materials", assignedTo: "Event Committee", status: "Pending" },
      ]
    }
  ],
  pastActivities: [
    {
      id: 4,
      title: "Beach Cleanup Day",
      startDate: "2024-03-01",
      endDate: "2024-03-01",
      location: "Santa Cruz Beach",
      participants: 30,
      status: "Completed",
      items: [
        { name: "Trash Bags", assignedTo: "Volunteers", status: "Completed" },
        { name: "Gloves", assignedTo: "Organizers", status: "Completed" },
      ]
    }
  ]
};

export const mockData = {
  getData: () => mockDataState,
  deleteItem: (type, id) => {
    const numId = parseInt(id);
    if (type === "trips") {
      mockDataState.trips = mockDataState.trips.filter(item => item.id !== numId);
    } else if (type === "events") {
      mockDataState.events = mockDataState.events.filter(item => item.id !== numId);
    } else if (type === "past") {
      mockDataState.pastActivities = mockDataState.pastActivities.filter(item => item.id !== numId);
    }
  }
}; 