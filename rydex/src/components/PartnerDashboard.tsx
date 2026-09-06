'use client'
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { motion } from "motion/react"
import { ArrowRight, Check, Clock, Lock, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RejectionCard from './RejectionCard';
import StatusCard from './StatusCard';
import ActionCard from './ActionCard';
import axios from 'axios';
import PricingModal from './PricingModal';
import { IVehicle } from '@/models/vehicle.model';
import PartnerEarning from './PartnerEarning';
type Step = {
    id: number,
    title: string,
    route?: string
};

/* ================= STEPS ================= */

const STEPS: Step[] = [
    { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
    { id: 2, title: "Documents", route: "/partner/onboarding/documents" },
    { id: 3, title: "Bank", route: "/partner/onboarding/bank" },
    { id: 4, title: "Review" },
    { id: 5, title: "Video KYC" },
    { id: 6, title: "Pricing" },
    { id: 7, title: "Final Review" },
    { id: 8, title: "Live" },
];

const TOTAL_STEPS = STEPS.length;

function PartnerDashboard() {
    const [activeStep, setActiveStep] = useState(0)
    const { userData } = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const [requestLoading,setRequestLoading]=useState(false)
    const [showPricing,setShowPricing]=useState(false)
    const [vehicleData,setVehicleData]=useState<IVehicle | null>(null)
    useEffect(() => {
        if (userData) {
            setActiveStep(userData.partnerOnBoardingSteps + 1)
        }
    }, [userData])

    const handleGetPricing=async ()=>{
        try {
            const {data}=await axios.get("/api/partner/onboarding/pricing")
            console.log(data)
            setVehicleData(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
      handleGetPricing()
    },[])

    const goToStep = (step: Step) => {

        if(step.id==6 && userData?.partnerStatus==="approved" && userData.videoKycStatus==="approved"){
            setShowPricing(true)
            return;
        }
        if (step.route && step.id <= activeStep) {
            router.push(step.route)
        }
    }

    const progressPercentage = ((activeStep - 1) / (TOTAL_STEPS - 1)) * 100
    return (
        <div className='min-h-screen bg-[#f5f7fa] px-4 pt-28 pb-20'>
            <div className='max-w-7xl mx-auto space-y-10'>
                <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-5'>
                    <div>
                        <p className='text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-3'>Partner workspace</p>
                        <h1 className='text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-gray-950'>Build your earning profile</h1>
                        <p className='text-gray-500 mt-3 max-w-xl'>Complete the verification steps to activate your vehicle and start accepting rides.</p>
                    </div>
                    <div className='rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm'>
                        <p className='text-[11px] font-semibold uppercase tracking-widest text-gray-400'>Account status</p>
                        <p className='mt-1 text-sm font-bold text-gray-900'>{userData?.partnerStatus === "approved" ? "Approved partner" : "Setup in progress"}</p>
                    </div>
                </div>

                <div className='bg-white rounded-2xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)] border border-gray-200/80 overflow-x-auto'>
                    <div className='flex items-center justify-between gap-4 mb-8'>
                        <div>
                            <p className='text-xs font-bold uppercase tracking-[0.18em] text-gray-400'>Activation checklist</p>
                            <h2 className='text-xl font-bold text-gray-900 mt-1'>Partner onboarding</h2>
                        </div>
                        <span className='text-sm font-semibold text-gray-500'>{Math.max(0, activeStep - 1)} of {TOTAL_STEPS - 1} complete</span>
                    </div>
                    <div className='relative min-w-[800px]'>

                        <div className='absolute top-7 left-0 w-full h-[3px] bg-gray-200 rounded-full' />
                        <motion.div
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.6 }}
                            className="absolute top-7 left-0 h-[3px] bg-blue-600 rounded-full"
                        />
                        <div className='relative flex justify-between'>
                            {STEPS.map((s, index) => {
                                const completed = s.id < activeStep
                                const active = s.id == activeStep
                                const locked = s.id > activeStep

                                return (
                                    <motion.div
                                        key={s.id}
                                        whileHover={!locked ? { scale: 1.1 } : {}}
                                        onClick={() => goToStep(s)}
                                        className="flex flex-col items-center z-10 cursor-pointer"
                                    >
                                        <div
                                            className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all
                                                     ${completed
                                                        ? "bg-gray-950 text-white border-gray-950"
                                                    : active
                                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                                        : "border-gray-300 text-gray-400 bg-white"
                                                }`}
                                        >
                                            {
                                                completed ? (
                                                    <Check size={20} />
                                                ) : locked ? (
                                                    <Lock size={20} />
                                                ) : (
                                                    s.id
                                                )
                                            }

                                        </div>
                                        <p className='mt-3 text-sm font-semibold text-center'>{s.title}</p>

                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {
                    activeStep == 4 && userData?.partnerStatus === "rejected" && (
                        <RejectionCard
                            title="Partner Rejected"
                            reason={userData.rejectionReason}
                            actionLabel={`Review and Update`}
                            onAction={() => {
                                router.push("/partner/onboarding/vehicle")
                            }}
                        />
                    )

                }

                {
                    activeStep == 4 && userData?.partnerStatus === "pending" && (
                        <StatusCard
                            icon={<Clock size={18} />}
                            title={"Documents under review"}
                            desc={"Admin is verifying your documents."}
                        />
                    )
                }



                {
                    activeStep==5 && (
                    userData?.videoKycStatus === "approved" ? (
                        <StatusCard
                            icon={<Check size={18} />}
                            title={"video kyc approved"}
                            desc={"You can now proceed to pricing."}
                        />
                    ) :   userData?.videoKycStatus === "rejected" ? (
                        <RejectionCard
                            title="Video KYC Rejected"
                            reason={userData?.videoKycRejectionReason}
                            actionLabel={requestLoading?"Requesting...":"Request Again"}
                            onAction={async ()=>{
                                setRequestLoading(true)
                              await axios.get("/api/partner/video-kyc/request")
                              setRequestLoading(false)
                            }}
                        />
                    ):   userData?.videoKycStatus === "in_progress" && userData?.videoKycRoomId ?(
                        <ActionCard
                        icon={<Video size={18}/>}
                        title={"Admin Started Video KYC"}
                        button={"Join Call"}
                        onclick={
                            ()=>router.push(`/video-kyc/${userData.videoKycRoomId}`)
                        }
                        />
                    ):
                    <StatusCard
                     icon={<Clock size={20} />}
                     title="Waiting for Admin"
                      desc="Admin will initiate Video KYC shortly."
                    />
                )

                
            
                }

                

{activeStep==7  && vehicleData?.status=="pending" && (
    <StatusCard
     icon={<Clock size={20} />}
        title="Pricing Under Review"
        desc="Admin is reviewing your pricing."
    />
)}
{activeStep==7  && vehicleData?.status=="rejected" && (
    <RejectionCard
      title="Pricing Rejected"
        reason={vehicleData.rejectionReason}
        actionLabel="Edit & Resubmit"
        onAction={() => setShowPricing(true)}
    />
)}

{activeStep==8 && vehicleData?.status=="approved" && (
    <motion.div
    initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
    className="bg-gray-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl"
    >
        <h2 className='text-2xl font-bold'>
                            You're Live
        </h2>

        <button onClick={() => router.push("/partner/pending-requests")} className='mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2'>
         Go to Bookings <ArrowRight size={16}/>
        </button>

    </motion.div>
)}


          <PartnerEarning/>
            </div>
          
          <PricingModal
          open={showPricing}
          onClose={()=>setShowPricing(false)}
          data={vehicleData}
          />


        </div>
    )
}

export default PartnerDashboard
