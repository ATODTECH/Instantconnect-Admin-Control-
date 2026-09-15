// use POINT() NOT NULL for coord. GIS-Spatial BE
type activeToggle = 'ongoing'|'past'
type Legend = 'active' | 'completed' | 'flagged'

interface ConnectionCardProps {
  user: LiveConnectUsersProps, 
  index?: number
}

interface UserCoordinates {
  lat: number,
  lng: number,
}

interface LiveConnectUsersProps {
  id: number,
  firstRecipient: {
    id: number,
    name: string,
    image: '',
    coordinates: {
      lat: number,
      lng: number,
    },
    departure: string,
  },
  secondRecipient: {
    id: number,
    name: string,
    image:'',
    coordinates: {
      lat: number,
      lng: number,
    },
    departure: string,
  },
  acceptConnect: string,
  location: string,
  meetingType: string,
  coordinates: {
    lat: number,
    lng: number,
  },
  safetyAlert: boolean,
  meetingStartTime: string,
  meetingEndTime: string,
  status: string,
}