'use client'
import AnimatedCard from '@/components/AnimatedCard'
import DocPreview from '@/components/DocPreview'
import { IPartnerBank } from '@/models/partnerBank.model'
import { IPartnerDocs } from '@/models/partnerDocs.model'
import { IUser } from '@/models/user.model'
import { IVehicle } from '@/models/vehicle.model'
import axios from 'axios'
import { url } from 'inspector'
import { ArrowLeft, Car, CheckCircle, CircleDashed, Clock, FileText, Landmark, ShieldCheck, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
function page() {
    const { id } = useParams()
    const [data, setData] = useState<IUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [vehicleDetails, setVehicleDetails] = useState<IVehicle | null>(null)
    const [partnerDocs, setPartnerDocs] = useState<IPartnerDocs | null>(null)
    const [partnerBank, setPartnerBank] = useState<IPartnerBank | null>(null)
    const [showApprove, setShowApprove] = useState(false)
    const [showReject, setShowReject] = useState(false)
    const [rejectionReason,setRejectionReason]=useState("")
    const [approveLoading,setApproveLoading]=useState(false)
      const [rejectLoading,setRejectLoading]=useState(false)
    const router = useRouter()
    const handleGetPartner = async () => {
        try {
            const { data } = await axios.get(`/api/admin/reviews/partner/${id}`)
            setData(data.partner)
            setVehicleDetails(data.vehicle)
            setPartnerDocs(data.documents)
            setPartnerBank(data.bank)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetPartner()
    }, [])


    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center text-gray-500">
                Loading Partner...
            </div>
        )
    }

    const handleApprove=async ()=>{
        setApproveLoading(true)
try {
    const {data}=await axios.get(`/api/admin/reviews/partner/${id}/approve`)
    console.log(data)
    setApproveLoading(false)
    router.push("/")
} catch (error) {
    console.log(error)
     setApproveLoading(false)
}
    }
     const handleReject=async ()=>{
      setRejectLoading(true)
try {
    const {data}=await axios.post(`/api/admin/reviews/partner/${id}/reject`,{
        rejectionReason
    })
    console.log(data)
    setRejectLoading(false)
     router.push("/")
} catch (error) {
    console.log(error)
    setRejectLoading(false)
}
    }
    return (
        <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200'>
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b'>
                <div className='max-w-7xl mx-auto px-4 h-16 flex items-center gap-4'>
                    <button className='w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition' onClick={() => router.back()}>
                        <ArrowLeft size={18} />
                    </button>
                    <div className='flex-1'>
                        <div className='font-semibold text-lg'>{data?.name}</div>
                        <div className='text-xs text-gray-500'>{data?.email}</div>
                    </div>
                    {
                        data?.partnerStatus === "approved" ? (
                            <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-green-100 text-green-700'>
                                <CheckCircle size={14} />
                                Approved
                            </div>
                        ) : data?.partnerStatus === "rejected" ? (
                            <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-red-100 text-red-700'>
                                <XCircle size={14} />
                                Rejected
                            </div>
                        ) : (
                            <div className='px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-yellow-100 text-yellow-700'>
                                <Clock size={14} />
                                Pending
                            </div>
                        )
                    }
                </div>
            </div>

            <main className='max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10'>
                <div className='lg:col-span-2 space-y-8'>
                    <AnimatedCard title="Vehicle Details" icon={<Car size={18} />}>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Vehicle Type</span>
                            <span className='font-semibold'>{vehicleDetails?.type || "-"}</span>
                        </div>

                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Registration Number</span>
                            <span className='font-semibold'>{vehicleDetails?.number || "-"}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Model</span>
                            <span className='font-semibold'>{vehicleDetails?.vehicleModel || "-"}</span>
                        </div>
                    </AnimatedCard>

                    <AnimatedCard title="Documents" icon={<FileText size={18} />}>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                            <DocPreview label={"Aadhaar"} url={partnerDocs?.aadharUrl} />
                            <DocPreview label={"Registration Certificate"} url={partnerDocs?.rcUrl} />
                            <DocPreview label={"Driving License"} url={partnerDocs?.licenseUrl} />
                        </div>
                    </AnimatedCard>
                </div>

                <div className='space-y-8'>
                    <AnimatedCard title={"Bank Details"} icon={<Landmark size={18} />}>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Account Holder</span>
                            <span className='font-semibold'>{partnerBank?.accountHolder || "-"}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Account Number</span>
                            <span className='font-semibold'>{partnerBank?.accountNumber || "-"}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>IFSC Code</span>
                            <span className='font-semibold'>{partnerBank?.ifsc || "-"}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Upi</span>
                            <span className='font-semibold'>{partnerBank?.upi || "-"}</span>
                        </div>

                    </AnimatedCard>

                    {data?.partnerStatus == "pending" && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[32px] p-8 shadow-xl space-y-6"
                        >
                            <div className='flex items-center gap-2 font-semibold'>
                                <ShieldCheck size={18} />
                                Admin Check
                            </div>
                            <p className='text-sm text-gray-500'>
                                Verify documents carefully before approving.
                            </p>

                            <div className='flex flex-col gap-4'>

                                <button
                                    className='py-3 rounded-2xl bg-linear-to-r from-black to-gray-800 text-white font-semibold hover:opacity-90 transition'
                                    onClick={()=>setShowApprove(true)}
                                >Approve
                                </button>

                                <button
                                    className='py-3 rounded-2xl border font-semibold hover:bg-gray-100 transition'
                                    onClick={()=>setShowReject(true)}
                                >Reject
                                </button>
                            </div>

                        </motion.div>
                    )}
                </div>
            </main>


            <AnimatePresence>
                {showApprove && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-sm"
                        >
                            <h2 className='text-lg font-bold'>Approve Partner?</h2>
                            <p className='text-sm text-gray-500 mt-2'>Confirm all information has been verified.</p>
                            <div className='flex gap-3 mt-6'>
                                <button className='flex-1 py-2 rounded-xl border' onClick={() => setShowApprove(false)}>Cancel</button>
                                <button className='flex-1 flex items-center justify-center py-2 rounded-xl bg-black text-white'
                                onClick={handleApprove}
                                disabled={approveLoading}
                                >{approveLoading?<CircleDashed className='text-white animate-spin'/>:"Yes, Approve"}</button>
                            </div>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showReject && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-sm"
                        >
                            <h2 className='text-lg font-bold'>Reject Partner?</h2>
                            <p className='text-sm text-gray-500 mt-2'>

                                <textarea
                                    placeholder="Enter rejection reason (required)"
                                    value={rejectionReason}
                                    onChange={(e)=>setRejectionReason(e.target.value)}
                                    className="w-full mt-3 border rounded-xl p-3 text-sm"
                                />
                            </p>
                            <div className='flex gap-3 mt-6'>
                                <button className='flex-1 py-2 rounded-xl border' onClick={() => setShowReject(false)}>Cancel</button>
                                <button className='flex-1 py-2 flex items-center justify-center rounded-xl bg-black  text-white' onClick={handleReject} disabled={rejectLoading}>{rejectLoading?<CircleDashed className='text-white animate-spin'/>:"Reject"}</button>
                            </div>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>



        </div>
    )
}

export default page
