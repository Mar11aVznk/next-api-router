let map = [ 
        { "id": 1, 
          "name": "Skolan",
          "lat": 59.3, 
          "lng": 18.1 }, 
        { "id": 2, 
          "name": "Biblioteket", 
          "lat": 59.4, 
          "lng": 18.05 } 
    ]
export async function GET() {
    return Response.json(map)
}

export async function POST(req: Request) {
  const data = await req.json()
  const newData = {
    id: map.length + 1,
    name: data.name,
    lat: data.lat,
    lng: data.lng
  }
 map.push(newData)
  return Response.json({msg: "Added successful"})
}