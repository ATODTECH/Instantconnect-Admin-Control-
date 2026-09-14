"use client"

import { APIProvider, Marker, Map } from "@vis.gl/react-google-maps"
import { useRef, useState } from "react"

const DEFAULT_CENTER = {lat: 6.42816, lng:  3.41897}

const GoogleMapIndex = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
  const [isOpen, setOpen] = useState<boolean>()

  if (!apiKey) {
    return <div className="text-sm text-red-600">Error: Missing Google Maps API Key</div>
  }

  return (
    <>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          <Marker position={DEFAULT_CENTER} />
        </Map>
      </APIProvider>
    </>
  )
}

export default GoogleMapIndex