let mapArr = [ 
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
    return Response.json(mapArr)
}

export async function POST(req: Request) {
  const data = await req.json()

  const maxId = mapArr.length > 0
    ? Math.max(...mapArr.map(item => item.id))
    : 0
  const newData = {
    id: maxId + 1,
    name: data.name,
    lat: data.lat,
    lng: data.lng
  }
 mapArr.push(newData)
  return Response.json(newData)
}

export async function DELETE(req:Request) {
  const {id} = await req.json()

  mapArr= mapArr.filter(item => item.id !== id)
  return Response.json({})
}

export async function PUT(req: Request) {
  const body = await req.json()
  const {id, name, lat, lng} = body

  if (!id) {
    return Response.json({error: "Ingen id"}, {status: 400})
  }

  const index = mapArr.findIndex(item => item.id === Number(id))

  if (index === -1) {
      return Response.json({error: "Lokation finns inte"}, {status: 400})
  }

  mapArr[index] = {
    ...mapArr[index],
    name,
    lat,
    lng
  }


  return Response.json(mapArr[index])

}