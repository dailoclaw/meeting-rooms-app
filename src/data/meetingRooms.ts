export interface MeetingRoom {
  id: number
  name: string
  capacity: number
  x: number // Percentage from left
  y: number // Percentage from top
}

export const meetingRooms: MeetingRoom[] = [
  { id: 1, name: 'The Hub', capacity: 60, x: 5.5, y: 12.5 },
  { id: 2, name: 'The Café', capacity: 70, x: 55.5, y: 8.5 },
  { id: 3, name: 'El Questro', capacity: 19, x: 94.5, y: 13 },
  { id: 4, name: 'Rottnest Island', capacity: 16, x: 54, y: 46 },
  { id: 5, name: 'Streaky Bay', capacity: 7, x: 39.5, y: 76 },
  { id: 6, name: 'Cradle Mountain', capacity: 7, x: 49.5, y: 76 },
  { id: 7, name: 'Broome', capacity: 7, x: 60, y: 76 },
  { id: 8, name: 'Undara', capacity: 11, x: 25, y: 4.5 },
  { id: 9, name: 'Pambula Beach', capacity: 5, x: 19, y: 39 },
  { id: 10, name: 'Lake Hume', capacity: 5, x: 20, y: 50 },
  { id: 11, name: 'Kings Canyon', capacity: 9, x: 20, y: 70 },
  { id: 12, name: 'Jindabyne', capacity: 5, x: 17.5, y: 86.5 },
  { id: 13, name: 'Goolwa', capacity: 5, x: 10, y: 86.5 },
  { id: 14, name: 'Mount Isa', capacity: 3, x: 65.5, y: 42.5 },
  { id: 15, name: 'Byron Bay', capacity: 3, x: 65.5, y: 50.5 },
  { id: 16, name: 'Airlie Beach', capacity: 3, x: 47, y: 56.5 },
  { id: 17, name: 'Bright', capacity: 3, x: 47, y: 67 },
]
