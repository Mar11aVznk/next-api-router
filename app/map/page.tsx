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

    const [name, setName] = useState("")
    const [lat, setLat] = useState<number | undefined>()
    const [lng, setLng] = useState<number | undefined>()
    const [update, setUpdate] = useState(false)

    const [updateId, setUpdateId] = useState<number | null>(null)
    const [updateName, setUpdateName] = useState<string>("")
    const [updateLat, setUpdateLat] = useState<number | null>(null)
    const [updateLng, setUpdateLng] = useState<number | null>(null)

    const startUpdate = (location: Location) => {
      setUpdateId(location.id)
      setUpdateName(location.name)
      setUpdateLat(location.lat)
      setUpdateLng(location.lng)
    }


    async function fetchMapData() {
      try {
        setLoading(true)
        const res = await fetch("/api/map")
        const data = await res.json()
        setLocations(data)
      } catch (error) {
        console.error("Något gick fel", error)
      } finally {
        setLoading(false)
      }
  
    }

  useEffect(()=> {
      fetchMapData()
  }, [update])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/map", {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({name, lat, lng})
    })

    const data = await res.json()

    setName("")
    setLat(undefined)
    setLng(undefined)
    setUpdate(!update)
  }

  async function handleDelete(id: number) {
    await fetch("/api/map", {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({id})
    })

    const res = await fetch("/api/map")
    const data = await res.json()
    setLocations(data)
    setUpdate(!update)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (updateId === null || updateLat === null || updateLng === null) return

    const updatedLocation = {
      id: updateId,
      name: updateName,
      lat: updateLat,
      lng: updateLng
    }

    const res = await fetch("/api/map", {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedLocation)
    })

    if (res.ok) {
      setUpdateId(null)
      setUpdate(!update)
    }
  }

  if (loading) {
    return<p className="mt-10 ml-10 text-2xl">Laddar...</p>
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
            <button onClick={() => startUpdate(location)}
            className="ml-5 p-1 border border-green-700 bg-green-400 hover:bg-green-200">Redigera</button>
            {updateId === location.id && (
              <form onSubmit={handleUpdate} className="mt-5 mb-5 bg-amber-200">
                <input value={updateName} className="bg-amber-100 m-2"
                onChange={e => setUpdateName(e.target.value)}/>
                <input type="number" value={updateLat ?? ""} className="bg-amber-100 m-2"
                onChange={e => setUpdateLat(Number(e.target.value))} />
                <input type="number" value={updateLng ?? ""} className="bg-amber-100 m-2"
                onChange={e => setUpdateLng(Number(e.target.value))} />
                <button type="submit" className="bg-emerald-200 m-2 border border-emerald-600 hover:bg-emerald-100">Spara ändringar</button>
              </form>
            )}
            <button onClick={()=> handleDelete(location.id)} className="ml-5 p-1 border border-red-500 bg-red-300 hover:bg-red-200">Ta bort</button>

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
      <button className="bg-amber-600 mt-5 w-20 border border-amber-900 hover:bg-amber-500">Skicka</button>
      </form>

       
    </div>

  )

}
