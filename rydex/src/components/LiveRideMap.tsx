import { LatLngExpression } from 'leaflet'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import L from "leaflet"
import axios from 'axios'
type Props = {
    driverLocation: [number, number] | null,
    pickUpLocation: [number, number] | null,
    dropLocation: [number, number] | null,
    mapStatus: string,
    onStats:(data:{
        distanceToPickUp:number,
        etaToPickUp:number,
      distanceToDrop:number,etaToDrop:number
    })=>void
}

const pickUpIcon = new L.DivIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.28))">
      <div style="background:#0a0a0a;color:#fff;padding:5px 13px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;font-family:system-ui">
        PICKUP
      </div>
      <div style="width:2px;height:9px;background:#0a0a0a"></div>
      <div style="width:10px;height:10px;background:#0a0a0a;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>
    </div>`,
    className: "",
    iconSize: [80, 50],
    iconAnchor: [40, 50],
})
const dropIcon = new L.DivIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.28))">
      <div style="background:#0a0a0a;color:#fff;padding:5px 13px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;font-family:system-ui">
        DROP
      </div>
      <div style="width:2px;height:9px;background:#0a0a0a"></div>
      <div style="width:10px;height:10px;background:#0a0a0a;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>
    </div>`,
    className: "",
    iconSize: [70, 50],
    iconAnchor: [35, 50],
})

const driverIcon = new L.DivIcon({
    html: `<div id="car-marker" style="
      width:52px; height:52px;
      display:flex; align-items:center; justify-content:center;
      transform-origin:center;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
      filter: drop-shadow(0 6px 18px rgba(0,0,0,0.5));
    ">
      <div style="
        background:#0a0a0a;
        width:46px; height:46px;
        border-radius:50%;
        display:flex; align-items:center; justify-content:center;
        box-shadow:0 0 0 3px #fff,0 0 0 5px #0a0a0a,0 8px 28px rgba(0,0,0,0.5);
      ">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 11L6.5 6.5H17.5L19 11" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
          <rect x="3" y="11" width="18" height="7" rx="2" stroke="white" stroke-width="1.6"/>
          <circle cx="7.5" cy="18.5" r="1.5" fill="white"/>
          <circle cx="16.5" cy="18.5" r="1.5" fill="white"/>
          <path d="M3 14H21" stroke="white" stroke-width="1" opacity="0.35"/>
        </svg>
      </div>
    </div>`,
    className: "",
    iconSize: [52, 52],
    iconAnchor: [26, 26],
})

function LiveRideMap({ driverLocation, dropLocation, pickUpLocation, mapStatus,onStats }: Props) {
    const [routeToPickUp, setRouteToPickUp] = useState<[number, number][]>([])
    const [routeToDrop, setRouteToDrop] = useState<[number, number][]>([])
    useEffect(() => {
        if (!driverLocation || !pickUpLocation || !dropLocation) return;
        const [pLat, pLon] = pickUpLocation 
        const [dLat, dLon] = dropLocation 
        const [drLat, drLon] = driverLocation 

        const getRoute = async (startLat: number, startLon: number, endLat: number, endLon: number) => {
            const res = await axios.get(`https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`)

            return res.data.routes?.[0]
        }

        const fetchRoutes = async () => {
            try {
                if (mapStatus === "arriving") {
                    const pickUpRoute = await getRoute(
                        drLat,
                        drLon,
                        pLat,
                        pLon
                    )
 console.log(pickUpRoute)
                    const dropRoute = await getRoute(
                        dLat,
                        dLon,
                        drLat,
                        drLon
                    )

                    if (pickUpRoute) {
                        setRouteToPickUp(pickUpRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
                    }
                    if (dropRoute) {
                        setRouteToDrop(dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
                    }

                onStats?.({
                    distanceToPickUp:(pickUpRoute?.distance ??0)/1000,
                  etaToPickUp:(pickUpRoute?.duration ??0)/60,
                  distanceToDrop:(dropRoute?.distance??0)/1000,
                  etaToDrop:(dropRoute?.duration??0)/60
                })



                }else{
                    setRouteToPickUp([])
                    
                    const dropRoute = await getRoute(
                        dLat,
                        dLon,
                        drLat,
                        drLon
                    )
                      if (dropRoute) {
                        setRouteToDrop(dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
                    }
                     onStats?.({
                    distanceToPickUp:0,
                  etaToPickUp:0,
                  distanceToDrop:(dropRoute?.distance??0)/1000,
                  etaToDrop:(dropRoute?.duration??0)/60
                })
                }
            } catch (error) {
             console.log(error)
            }
        }

        fetchRoutes()

    }, [driverLocation,mapStatus])

const showPickMarker=mapStatus==="arriving"
const showPickUpRoute=mapStatus==="arriving" && routeToPickUp.length>0
const showDropRoute=mapStatus!="completed" && routeToDrop.length>0

    return (
        <div className='relative h-full w-full bg-zinc-100'>
            <MapContainer
                style={{ width: "100%", height: "100%" }}
                center={pickUpLocation as any}
                zoom={13}
                zoomControl={false}
            >


                <TileLayer

                    attribution='&copy; <a href="https://carto.com/">"CARTO"</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />



                {showPickMarker && <Marker
                    position={pickUpLocation as any}
                    icon={pickUpIcon}
                    draggable


                />}
                {dropLocation && <Marker
                    position={dropLocation as any}
                    icon={dropIcon}
                    draggable

                />}
                {driverLocation && <Marker
                    position={driverLocation as any}
                    icon={driverIcon}
                    draggable

                />}
                
                {showPickUpRoute && (
                    <Polyline positions={routeToPickUp}  pathOptions={{ color: "#888", weight: 4, dashArray: "2 10", lineCap: "round"  }}/>
                )}
                 {showDropRoute && (
                    <Polyline positions={routeToDrop}  pathOptions={{ color: "#0a0a0a", weight: 4, lineCap: "round", lineJoin: "round" }}/>
                )}

            </MapContainer>



        </div>
    )
}

export default LiveRideMap
