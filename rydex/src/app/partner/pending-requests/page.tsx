'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import axios from 'axios'
import { BookingStatus,  PaymentStatus } from '@/models/booking.model'
import { Clock, IndianRupee, Loader2, MapPin, Navigation } from 'lucide-react'
import { div } from 'motion/react-client'
import { useRouter } from 'next/navigation'
import { getSocket } from '@/lib/socket'

 interface IBooking {
    _id:string
    user: string
    driver: string
    vehicle:string
    pickUpAddress: string
    dropAddress: string

    pickUpLocation: {
        type: "Point",
        coordinates: [number, number]
    }
    dropLocation: {
        type: "Point",
        coordinates: [number, number]
    }

    fare: number

    userMobileNumber: string
    driverMobileNumber: string

    bookingStatus: BookingStatus
    paymentStatus: PaymentStatus
    paymentDeadline:Date
    adminCommission: number
    partnerAmount: number

    pickUpOtp: string,
    pickUpOtpExpires: Date
    dropOtp: string,
    dropOtpExpires: Date,
    createdAt?: Date
    updatedAt?: Date
}

function page() {

    const [bookings, setBookings] = useState<IBooking[]>([])
    const [loading, setLoading] = useState(false)
    const router=useRouter()
    const fetchPendingRequests = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get("/api/partner/bookings/pending")
            setBookings(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const handleAccept=async (id:string)=>{
        try {
           const {data}=await axios.get(`/api/partner/bookings/${id}/accept`) 
           router.push("/partner/bookings")

        } catch (error) {
            console.log(error)
        }
    }



    const handleReject=async (id:string)=>{
        try {
           const {data}=await axios.get(`/api/partner/bookings/${id}/reject`) 
           window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPendingRequests()
        const refreshTimer = window.setInterval(fetchPendingRequests, 3000)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") fetchPendingRequests()
        }
        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => {
            window.clearInterval(refreshTimer)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])

    useEffect(()=>{
     const socket=getSocket()
     console.log(socket)
     socket.on("new-booking",(data)=>{
             fetchPendingRequests()
     })
     return ()=>{
        socket.off("new-booking")
     }
    },[])
    return (
        <div className='min-h-screen bg-[#f4f5f7]'>
            <div className='bg-white border-b border-gray-200'>
                <div className='max-w-6xl mx-auto px-6 py-16'>
                    <h1 className='text-4xl font-semibold text-gray-900'>Ride Requests</h1>
                    <p className='mt-3 text-gray-500 text-lg'> Manage incoming ride requests and respond in real time.</p>
                </div>
            </div>

            <div className='max-w-6xl mx-auto px-6 py-12'>
                {loading ? (
                    <div className='flex justify-center py-20'>
                        <Loader2 className="animate-spin w-8 h-8 text-gray-700" />
                    </div>
                ) : bookings.length == 0 ? (
                    <div className='bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm'>
                        <p className='text-gray-500 text-lg'>No pending ride requests.</p>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {bookings.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.25 }}
                                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition"
                            >
                                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8'>

                                    <div className="flex-1 space-y-6">

                                        <div className='flex gap-4'>
                                            <div className='bg-gray-100 p-3 rounded-lg flex items-center justify-center'>
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <p className='text-xs uppercase text-gray-400 mb-1'>Pickup Location</p>
                                                <p className='text-gray-900 font-medium'>{b.pickUpAddress}</p>
                                            </div>
                                        </div>

                                        <div className='flex gap-4'>
                                            <div className='bg-gray-100 p-3 rounded-lg flex items-center justify-center'>
                                                <Navigation size={18} />
                                            </div>
                                            <div>
                                                <p className='text-xs uppercase text-gray-400 mb-1'>Drop Location</p>
                                                <p className='text-gray-900 font-medium'>{b.dropAddress}</p>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-2 text-sm text-gray-500 mt-2'>
                                            <Clock size={14} className="opacity-70" />
                                            <span className='font-medium'>
                                                {new Date(b?.createdAt!).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"

                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex flex-col justify-between lg:items-end gap-6 w-full lg:w-auto'>

                                        <div className='text-left lg:text-right'>
                                            <p className='text-xs tracking-wide text-gray-400 uppercase mb-1'>Estimated Fare</p>
                                            <div className='flex items-center gap-2 text-3xl font-bold text-gray-900 lg:justify-end'>
                                                <IndianRupee size={20} />
                                                {b.fare}
                                            </div>
                                        </div>

                                        <div className='flex gap-4 w-full lg:w-auto'>
                                            <button
                                            onClick={()=>handleReject(b._id)}
                                             className='flex-1 lg:flex-none
        px-6 py-3
        rounded-xl
        border border-gray-300
        bg-white
        text-gray-700
        text-sm font-semibold
        hover:bg-gray-100
        transition-all duration-200
        active:scale-[0.98]
        disabled:opacity-50'>
                                                Reject
                                            </button>
                                            <button 
                                            onClick={()=>handleAccept(b._id)}
                                            className=' flex-1 lg:flex-none
        px-8 py-3
        rounded-xl
        bg-black
        text-white
        text-sm font-semibold
        shadow-md
        hover:bg-gray-900
        hover:shadow-lg
        transition-all duration-200
        active:scale-[0.98]
        disabled:opacity-50
        flex items-center justify-center'>
                                                Accept Ride
                                                </button>
                                        </div>

                                    </div>

                                </div>

                            </motion.div>
                        ))}
                    </div>

                )

                }
            </div>

        </div>
    )
}

export default page
