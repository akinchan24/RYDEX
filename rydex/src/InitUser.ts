'use client'
import { useSession } from 'next-auth/react'
import React from 'react'
import useGetMe from './hooks/useGetMe'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store'
import GeoUpdater from './components/GeoUpdater'

function InitUser() {
   
const {status}=useSession()
useGetMe(status=="authenticated")
const userData=useSelector((state:RootState)=>state.user.userData)
return React.createElement(GeoUpdater, {
	userId: userData?._id?.toString(),
	enabled: userData?.role === "partner"
})
}

export default InitUser
