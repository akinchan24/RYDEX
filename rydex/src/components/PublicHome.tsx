'use client'
import React, { useState } from 'react'
import HeroSection from './HeroSection'
import VehicleSlider from './VehicleSlider'
import AuthModal from './AuthModal'

function PublicHome() {
 const [authOpen,setAuthOpen]=useState(false)
  return (
    <>
      <HeroSection onAuthRequired={()=>setAuthOpen(true)}/>
      <VehicleSlider/>
      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)}/>
    </>
  )
}

export default PublicHome
