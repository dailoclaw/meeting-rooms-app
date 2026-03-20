import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { type MeetingRoom } from '../data/meetingRooms'

interface LeafletMapProps {
  selectedRoom: MeetingRoom | null
  onRoomSelect: (room: MeetingRoom) => void
  rooms: MeetingRoom[]
  enlarged?: boolean
}

// Hardcoded pixel coordinates (x, y format)
const roomCoordinates: Record<number, [number, number]> = {
  1: [51.9, 91.2],
  2: [523.9, 62.1],
  3: [892.1, 94.9],
  4: [509.8, 335.8],
  5: [372.9, 554.8],
  6: [467.3, 554.8],
  7: [566.4, 554.8],
  8: [236.0, 32.9],
  9: [179.4, 284.7],
  10: [188.8, 365.0],
  11: [188.8, 511.0],
  12: [165.2, 631.5],
  13: [94.4, 631.5],
  14: [618.3, 310.2],
  15: [618.3, 368.6],
  16: [443.7, 412.4],
  17: [443.7, 489.1],
}

export default function LeafletMap({ selectedRoom, onRoomSelect, rooms, enlarged = false }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<number, L.CircleMarker>>(new Map())

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return

    console.log('Initializing Leaflet map...')

    // Image dimensions
    const w = 944
    const h = 730

    // Create map with CRS.Simple - IMPORTANT: minZoom must be negative enough
    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 2,
      center: [h / 2, w / 2],
      zoom: enlarged ? 0.5 : 0,
      zoomControl: enlarged,
      attributionControl: false,
      scrollWheelZoom: enlarged,
      doubleClickZoom: enlarged,
      touchZoom: enlarged,
    })

    console.log('Map created')

    // Define bounds: [[south, west], [north, east]]
    // For images: south=height (bottom), north=0 (top)
    const bounds = new L.LatLngBounds(
      [h, 0],  // bottom-left corner
      [0, w]   // top-right corner
    )
    
    console.log('Bounds:', bounds)

    // Add image overlay
    L.imageOverlay('/meeting-rooms-map.jpg', bounds).addTo(map)
    console.log('Image overlay added')
    
    // Fit map to bounds initially
    map.fitBounds(bounds)
    
    // Set max bounds to prevent panning outside image
    map.setMaxBounds(bounds.pad(0.1))
    
    console.log(`Adding ${rooms.length} markers...`)

    // Add markers
    rooms.forEach(room => {
      const coords = roomCoordinates[room.id]
      if (!coords) {
        console.warn(`No coordinates for room ${room.id}`)
        return
      }
      
      const [px_x, px_y] = coords
      
      // Convert pixel coordinates to Leaflet LatLng
      // With bounds [[h, 0], [0, w]], we need to invert Y
      const lat = h - px_y  // Invert Y: bottom is h, top is 0
      const lng = px_x
      
      console.log(`Room ${room.id}: pixel[${px_x}, ${px_y}] -> latLng[${lat}, ${lng}]`)
      
      const marker = L.circleMarker([lat, lng], {
        radius: enlarged ? 20 : 15,
        fillColor: '#ffc107',
        color: '#ffc107',
        weight: 2,
        fillOpacity: 0.4,
        opacity: 0.8,
      })
      .addTo(map)
      .on('click', (e) => {
        L.DomEvent.stopPropagation(e)
        onRoomSelect(room)
      })

      marker.bindTooltip(`#${room.id} ${room.name}`, {
        permanent: false,
        direction: 'top',
        offset: [0, -10]
      })

      markersRef.current.set(room.id, marker)
    })

    console.log(`Markers added: ${markersRef.current.size}`)

    leafletMapRef.current = map

    return () => {
      console.log('Cleaning up map')
      map.remove()
      leafletMapRef.current = null
      markersRef.current.clear()
    }
  }, [enlarged, rooms, onRoomSelect])

  // Update marker styles when selection changes
  useEffect(() => {
    if (!leafletMapRef.current) return

    markersRef.current.forEach((marker, roomId) => {
      const isSelected = selectedRoom?.id === roomId
      marker.setStyle({
        radius: enlarged ? (isSelected ? 25 : 20) : (isSelected ? 18 : 15),
        fillColor: isSelected ? '#ffc107' : '#ffc107',
        fillOpacity: isSelected ? 0.7 : 0.4,
        weight: isSelected ? 3 : 2,
        opacity: isSelected ? 1 : 0.8,
      })
    })

    // Zoom and pan to selected room
    if (selectedRoom) {
      const coords = roomCoordinates[selectedRoom.id]
      if (coords) {
        const [px_x, px_y] = coords
        const lat = 730 - px_y
        const lng = px_x
        
        if (enlarged) {
          // On enlarged view, zoom in to 1.5x
          leafletMapRef.current.setView([lat, lng], 1.5, { animate: true })
        } else {
          // On main view, zoom in to 1x
          leafletMapRef.current.setView([lat, lng], 1, { animate: true })
        }
      }
    } else {
      // No room selected - zoom back out to fit bounds
      if (leafletMapRef.current) {
        const bounds = new L.LatLngBounds([730, 0], [0, 944])
        leafletMapRef.current.fitBounds(bounds)
      }
    }
  }, [selectedRoom, enlarged])

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: enlarged ? '80vh' : '400px',
        backgroundColor: '#f0f0f0',
        position: 'relative',
      }}
    />
  )
}
