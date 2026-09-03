'use client'
import React from 'react'
import { motion } from "motion/react"
import { ArrowRight, CheckCircle2, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
function ContentList({ data, type }: any) {
    const router = useRouter()
    console.log(data)
const handleStartVideoKyc=async (id:any)=>{
    try {
        const result=await axios.get(`/api/admin/video-kyc/start/${id}`)
        window.location.reload()
    } catch (error) {
        console.log(error)
    }
}



    if (data?.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl py-16 text-center border border-dashed border-gray-200 shadow-sm"
            >
                <div className='w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-4'>
                    <CheckCircle2 size={22} className='text-green-400' />
                </div>
                <p className='font-bold text-gray-800 text-base'>All caught up!</p>
                <p className='text-sm text-gray-400 mt-1'>No pending items right now.</p>

            </motion.div>
        )
    }



    return (
        <div className='space-y-3'>
            <div className='flex items-center justify-between px-1 mb-1'>
                <p className='text-xs font-semibold uppercase tracking-widest text-gray-400'>
                    {type === "partner" ? "Partner Reviews Queue" : type === "kyc" ? "Pending Video KYC Queue" : "vehicle Reviews Queue"}
                </p>
                <p className='text-xs text-gray-400'>{data.length} items</p>
            </div>

            {data.map((item: any, index: number) => {
                const name = item.name || item.owner.name
                const email = item.email || item.owner.email

                return (
                    <motion.div
                        key={`${item._id ?? item.owner?._id ?? type}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                        className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 shadow-sm transition-shadow"
                    >
                        <div className='flex items-center gap-3 min-w-0'>
                            <div className='w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-purple-100 text-purple-800'>{name.charAt(0).toUpperCase()  ?? <User size={14} />}</div>

                            <div className='min-w-0'>
                                <p className='font-bold text-sm text-gray-900 truncate'>{name}</p>
                                <p className='text-xs text-gray-400 truncate'>{email}</p>
                            </div>
                        </div>

                        <div className='shrink-0'>

                            {item.videoKycStatus === "pending" ? (
                                <motion.button
                                    whileTap={{ scale: 0.96 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold transition-colors"
                                  onClick={()=>handleStartVideoKyc(item._id)}
                                >
                                    Start Video KYC <ArrowRight size={15} />
                                </motion.button>
                            ) : item.videoKycStatus === "in_progress" ? (
                                <motion.button
                                    whileTap={{ scale: 0.96 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold transition-colors"
                                 onClick={()=>router.push(`/video-kyc/${item.videoKycRoomId}`)}
                                >
                                    Join Call <ArrowRight size={15} />
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.96 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold transition-colors"
                                    onClick={() => {
                                        type == "partner" ? router.push(`/admin/reviews/partner/${item._id}`) : router.push(`/admin/reviews/vehicle/${item._id}`)
                                    }}
                                >
                                    Review <ArrowRight size={15} />
                                </motion.button>
                            )}

                        </div>

                    </motion.div>
                )
            })}
        </div>
    )
}

export default ContentList
