'use client'
import { getSocket } from '@/lib/socket';
import axios from 'axios';
import React, { useEffect, useRef } from 'react'

function GeoUpdater({userId, enabled = true}:{userId?:string, enabled?:boolean}) {

    const socketRef=useRef<any>(null)
    
    useEffect(()=>{
   if(!enabled || !userId)return;
    if(!navigator.geolocation)return;
    
    socketRef.current=getSocket()
     socketRef.current.emit("identity",userId)

     const sendLocation=(coords:GeolocationCoordinates)=>{
      const location={
            userId,
            latitude: coords.latitude,
            longitude: coords.longitude
      }
      socketRef.current.emit("update-location",location)
      void axios.post("/api/user/location", {
            latitude: coords.latitude,
            longitude: coords.longitude
      })
     }

     navigator.geolocation.getCurrentPosition(({coords})=>sendLocation(coords),(err)=>{
        console.log(err)
     },
     {
        enableHighAccuracy:true,
        maximumAge:5000
     })

     const watcher=navigator.geolocation.watchPosition(({coords})=>sendLocation(coords),(err)=>{
        console.log(err)
     },{
        enableHighAccuracy:true,
        maximumAge:5000
     })

    return ()=>{navigator.geolocation.clearWatch(watcher)}


   },[enabled,userId])

  return null
}

export default GeoUpdater
