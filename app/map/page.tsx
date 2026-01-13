"use client"
import { useEffect, useState } from "react"

type Location = {
    id: number;
    name: string;
    lat: number;
    lng: number;

}

export default function PlacePage() {

    const [locations, setLocations] = useState<Location[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

useEffect(() => {
  async function fetchLocations() {
    try {
      const res = await fetch("/api/map")

      if (!res.ok) {

        throw new Error("Failed to fetch data")
      }

      const data: Location[] = await res.json()

      setLocations(data)

    } catch {

      setError("Kunde inte hämtas data från API")

    } finally {

      setLoading(false)

    }
  }

  fetchLocations()

}, [])

if (loading) {

  return<p>Laddar...</p>

}

if (error) {

  return <p>{error}</p>

}

  return (
    <div>
      <h1>Platser från API-route</h1>
      <p>Denna data hämtas från <code>/api/map</code></p>
      <ul>
        {locations.map((location) =>(
          <li key={location.id}>
            <strong>{location.name}</strong>
            <br/>
            Lat: {location.lat}, Lng: {location.lng}
          </li>
        ))}
      </ul>
       
    </div>
  )
}
