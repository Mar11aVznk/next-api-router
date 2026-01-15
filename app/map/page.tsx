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

    const [name, setName] = useState("")
    const [lat, setLat] = useState<number | undefined>()
    const [lng, setLng] = useState<number | undefined>()
    const [update, setUpdate] = useState(false)


    async function fetchMapData() {
      const res = await fetch("/api/map")
      const data = await res.json()
      setLocations(data)
    }

  useEffect(()=> {
      fetchMapData()
  }, [update])

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/map", {
      method: 'post',
      body: JSON.stringify({name, lat, lng})
    })

    const data = await res.json()

    setName("")
    setLat(undefined)
    setLng(undefined)

    setUpdate(!update)

  }

  if (loading) {
    return<p className="mt-10 ml-10 text-2xl">Laddar...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (

    <div className="ml-10">
      <h1 className="text-2xl mt-5">Platser från API-route</h1>
      <p className=" text-gray-700 italic mt-5">Denna data hämtas från <code>/api/map</code></p>
      <ul className="mt-5">
        {locations.map((location) => (
          <li key={location.id}>
            <strong>{location.name}</strong>
            <br/>
            Lat: {location.lat}, Lng: {location.lng}
          </li>
        ))}
      </ul>
      
    <form onSubmit={handleSubmit}>
      <input className="bg-amber-50 mt-5 border border-amber-600 pl-2" onChange={(e)=>setName(e.target.value)} type="text" value={name} placeholder="Sriv en plats..." />
        <br/>
      <input className="bg-amber-50 mt-5 border border-amber-600 pl-2" onChange={(e) => setLat(Number(e.target.value))} value={lat ?? ""} type="number"/>
        <br/>
      <input className="bg-amber-50 mt-5 border border-amber-600 pl-2" onChange={(e)=> setLng(Number(e.target.value))} value={lng ?? ""} type="number"/>
        <br/>
      <button className="bg-amber-600 mt-5 w-20 border border-amber-900">Send</button>
      </form>
       
    </div>

  )

}
