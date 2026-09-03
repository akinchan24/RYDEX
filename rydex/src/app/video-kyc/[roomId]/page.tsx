'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { CheckCircle, Mic, MicOff, PhoneOff, Video, VideoOff, X, XCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { AnimatePresence,motion } from 'motion/react';
function page() {
  const { userData } = useSelector((state: RootState) => state.user)
  const containerRef = useRef<HTMLDivElement>(null)
  const [joined, setJoined] = useState(false)
  const previewRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
 const {roomId}=useParams()
 const [loading,setLoading]=useState(false)
 const [reason,setReason]=useState("")
 const [aLoading,setALoading]=useState(false)
 const [rLoading,setRLoading]=useState(false)
 const [showApprovalModal,setShowApprovalModel]=useState(false)
  const [showRejectionModal,setShowRejectionModel]=useState(false)
 const hasJoinedRef=useRef(false)
 const router=useRouter()
  useEffect(() => {
    if (joined) return
    let localstream: MediaStream
    const init = async () => {
      try {
        localstream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setStream(localstream)
        if (previewRef.current) {
          previewRef.current.srcObject = localstream
        }
      } catch (error) {
        console.log(error)
      }


    }

    init()


  }, [])

  const toggleCamera = () => {
    if (!stream) return
    stream.getVideoTracks().forEach((track) => track.enabled = !isCameraOn);
    setIsCameraOn(!isCameraOn)
  }

  const toggleMic = () => {

    if (!stream) return
    stream.getAudioTracks().forEach((track) => track.enabled = !isMicOn);
    setIsMicOn(!isMicOn)
  }

const handleApprove=async ()=>{
  setALoading(true)
try {
  const {data}=await axios.post("/api/admin/video-kyc/complete",{roomId,action:"approved"})
  console.log(data)
  setALoading(false)
    router.push("/")
} catch (error:any) {
  console.log(error.response.data.message ?? error)
  setALoading(false)
}
}
const handleReject=async ()=>{
  setRLoading(true)
try {
  const {data}=await axios.post("/api/admin/video-kyc/complete",{roomId,action:"rejected",reason})
  console.log(data)
  setRLoading(false)
  router.push("/")
} catch (error:any) {
  console.log(error.response.data.message ?? error)
   setRLoading(false)
}
}




  const startCall = async () => {
    if (!containerRef.current || hasJoinedRef.current || loading || !userData?._id || !roomId) return
    hasJoinedRef.current=true
    setLoading(true)

    const displayName=userData?.role=="admin"?"Admin":`${userData?.name} (${userData?.email})`
    try {
      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret!,
        roomId?.toString()!,
        userData?._id.toString()!,
        displayName
      )

      const zp = ZegoUIKitPrebuilt.create(kitToken)
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter 
        },
        showPreJoinView: false

      });
      setJoined(true)
      setLoading(false)
    } catch (error) {
      console.log(error)
      hasJoinedRef.current=false
      setLoading(false)
    }
  }
  return (
    <div className='min-h-screen bg-black text-white flex flex-col'>
      <div className='px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <Image src={"/logo.png"} alt='logo' width={44} height={44} priority />
          <p className='text-xs text-gray-400'>{userData?.role == "admin" ? "Admin Verification" : "Partner Video KYC"}</p>
        </div>

        {joined && (
          <div className='flex flex-wrap gap-3'>
           {userData?.role==="admin" && (
            <>
            <button 
            className='bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm flex items-center gap-2'
             onClick={()=>{
              setShowApprovalModel(true)
         
            }   
            }
              ><CheckCircle size={16}/> Approve</button>
            <button 
            className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm flex items-center gap-2' 
            onClick={()=>{
              setShowRejectionModel(true)
              
              }}
              ><XCircle size={16}/> Reject</button>
            </>
           )}
           <button 
           className='bg-red-700 hover:bg-red-800 px-4 py-2 rounded-full text-sm flex items-center gap-2'
           onClick={()=>router.push("/")}
           ><PhoneOff size={16}/> End Call</button>
          </div>
        )}

      </div>
      <div className='flex-1 relative'>
        <div ref={containerRef} className={`absolute inset-0 ${
            joined ? "block" : "hidden"
          }`}/>
        {!joined && (
          <div className='h-full flex items-center justify-center px-4 py-10'>
            <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div className='relative rounded-2xl overflow-hidden border border-white/10 bg-white/5'>
                <video
                  ref={previewRef}
                  autoPlay
               
                  playsInline
                  className='w-full h-[300px] sm:h-[400px] object-cover'
                />

                {!isCameraOn && (
                  <div className='absolute inset-0 bg-black flex items-center justify-center'><VideoOff size={40}/></div>
                )}
              </div>

<div className='space-y-8 text-center lg:text-left'>
<h1 className='text-3xl sm:text-4xl font-bold'>
Secure Video KYC
</h1>
<div className='flex justify-center lg:justify-start gap-6'>
  <button
  onClick={toggleCamera}
  className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                      isCameraOn
                        ? "bg-white text-black"
                        : "bg-white/10 border border-white/20"
                    }`}
  >{isCameraOn?<Video/>:<VideoOff/>}</button>

  <button
  onClick={toggleMic}
  className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                      isMicOn
                        ? "bg-white text-black"
                        : "bg-white/10 border border-white/20"
                    }`}
  >{isMicOn?<Mic/>:<MicOff/>}</button>
</div>

<button
   onClick={startCall}
   className="w-full bg-white text-black py-4 rounded-xl font-semibold"
   disabled={loading}
>
  {loading?"Connecting...":"Join Secure Call"}
 
</button>


</div>

            </div>
          </div>
        )}
      </div>
 <AnimatePresence>
  {showApprovalModal && (
    <motion.div
     initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
      initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative bg-[#111] w-full max-w-md rounded-2xl p-6 shadow-2xl"
      >
        <button className='absolute top-4 right-4 text-gray-400' onClick={()=>setShowApprovalModel(false)}><X size={16}/></button>

        <h2 className='text-lg font-semibold mb-4'>
          Confirm Approval
        </h2>
<div className='flex gap-4'>
 <button onClick={()=>setShowApprovalModel(false)} className='flex-1 border rounded-xl py-2'>Cancel</button>
        <button className='flex-1 bg-green-600 rounded-xl py-2' disabled={aLoading} onClick={handleApprove}>{aLoading?"Processing...":"Approve"}</button>
</div>
       

      </motion.div>

    </motion.div>
  )}
 </AnimatePresence>

 <AnimatePresence>
  {showRejectionModal && (
    <motion.div
     initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
      initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative bg-[#111] w-full max-w-md rounded-2xl p-6 shadow-2xl"
      >
        <button className='absolute top-4 right-4 text-gray-400' onClick={()=>setShowRejectionModel(false)}><X size={16}/></button>

        <h2 className='text-lg font-semibold mb-4'>
          Reject Partner
        </h2>

        <textarea
        placeholder='Give Rejection Reason'
         value={reason}
         onChange={(e)=>setReason(e.target.value)}
         className='w-full bg-white/10 border border-white/20 rounded-xl p-3 mb-4 text-sm'/>
<div className='flex gap-4'>
 <button onClick={()=>setShowRejectionModel(false)} className='flex-1 border rounded-xl py-2'>Cancel</button>
        <button className='flex-1 bg-green-600 rounded-xl py-2' disabled={rLoading} onClick={handleReject}>{rLoading?"Processing...":"Reject"}</button>
</div>
       

      </motion.div>

    </motion.div>
  )}
 </AnimatePresence>
    </div>
  )
}

export default page
