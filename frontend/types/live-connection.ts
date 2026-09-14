// use POINT() NOT NULL for coord. GIS-Spatial BE
type activeToggle = 'ongoing'|'past'
type Legend = 'active' | 'completed' | 'flagged'

interface ConnectionCardProps {
  user: LiveConnectUsersProps, 
  index?: number
}

interface UserCoordinates {
  lat: string,
  lng: string,
}

interface LiveConnectUsersProps {
  id: number,
  firstRecipient: {
    id: number,
    name: string,
    image: '',
    coordinates: {
      lat: string,
      lng: string,
    },
    departure: string,
  },
  secondRecipient: {
    id: number,
    name: string,
    image:'',
    coordinates: {
      lat: string,
      lng: string,
    },
    departure: string,
  },
  acceptConnect: string,
  location: string,
  meetingType: string,
  coordinates: {
    lat: string,
    lng: string,
  },
  safetyAlert: boolean,
  meetingStartTime: string,
  meetingEndTime: string,
  status: string,
}