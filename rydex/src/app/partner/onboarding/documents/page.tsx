'use client'
import React, { useState } from 'react'
import { motion } from "motion/react"
import { ArrowLeft, CircleDashed, FileCheck, UploadCloud } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

type docsType="aadhar"|"license"|"rc"
function page() {
  const router = useRouter()
  const [docs,setDocs]=useState<Record<docsType,File | null>>({
    aadhar:null,
    license:null,
    rc:null
  })

  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")

  const handleDocs=async ()=>{
    setLoading(true)
    setError("")
    try {
      const formdata=new FormData()
      if(!docs.aadhar || !docs.license || !docs.rc){
       
          setError("all documents are required")
          setLoading(false)
           return null
      }
      formdata.append("aadhar",docs.aadhar)
       formdata.append("license",docs.license)
        formdata.append("rc",docs.rc)

      const {data}=await axios.post("/api/partner/onboarding/documents",formdata)
      setLoading(false)
      router.push("/partner/onboarding/bank")
    } catch (error:any) {
      setError(error?.response?.data?.message ?? "something went wrong")
      console.log(error)
      setLoading(false)
    }
  }

  const handleImage=(doc:docsType,file:File | null)=>{
if(!file){
  return
}
setDocs((prev)=>({...prev,[doc]:file}))
  }

  const isCompleted=docs.aadhar && docs.license && docs.rc
  return (
    <div className='min-h-screen bg-white flex items-center justify-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8"
      >
        <div className='relative text-center'>
          <button className='absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition'
            onClick={() => router.back()}
          ><ArrowLeft size={18} /></button>

          <p className='text-xs text-gray-500 font-medium'>
            step 2 of 3
          </p>

          <h1 className='text-2xl font-bold mt-1'>
            Upload Documents
          </h1>
          <p className='text-sm text-gray-500 mt-2'>
            Required for verification
          </p>

        </div>

        <div className='mt-8 space-y-5'>
          <motion.label
          whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            <div>
<p className='text-sm font-semibold'>Aadhaar / ID Proof</p>
<p className='text-xs text-gray-500'>Government issued ID</p>
            </div>
           
    {docs.aadhar ? 
    <span className='text-xs text-green-600 font-medium'>Uploaded</span>
    :
    <div>
      <span className='text-xs text-gray-400'>Upload</span>
      <div className='w-10 h-10 rounded-full bg-black text-white flex items-center justify-center'><UploadCloud size={18}/></div>
            </div>}          


            <input type='file' hidden accept='image/*,.pdf' onChange={(e)=>handleImage("aadhar",e.target?.files?.[0] || null)}/>

          </motion.label>

           <motion.label
          whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            <div>
<p className='text-sm font-semibold'>Driving License</p>
<p className='text-xs text-gray-500'>Valid driving license</p>
            </div>
            {docs.license ? 
    <span className='text-xs text-green-600 font-medium'>Uploaded</span>
    :
    <div>
      <span className='text-xs text-gray-400'>Upload</span>
      <div className='w-10 h-10 rounded-full bg-black text-white flex items-center justify-center'><UploadCloud size={18}/></div>
            </div>}     
 <input type='file' hidden accept='image/*,.pdf' onChange={(e)=>handleImage("license",e.target?.files?.[0] || null)}/>
          </motion.label>
           <motion.label
          whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            <div>
<p className='text-sm font-semibold'>Vehicle RC</p>
<p className='text-xs text-gray-500'>Registration Certificate</p>
            </div>
            {docs.rc ? 
    <span className='text-xs text-green-600 font-medium'>Uploaded</span>
    :
    <div>
      <span className='text-xs text-gray-400'>Upload</span>
      <div className='w-10 h-10 rounded-full bg-black text-white flex items-center justify-center'><UploadCloud size={18}/></div>
            </div>}     
 <input type='file' hidden accept='image/*,.pdf' onChange={(e)=>handleImage("rc",e.target?.files?.[0] || null)}/>
          </motion.label>

          

        </div>

        <div className='mt-6 flex items-start gap-3 text-xs text-gray-500'>
          <FileCheck size={16} className="mt-0.5"/>
          <p> Documents are securely stored and manually verified
            by our team.</p>
        </div>
          {error && <p className='text-red-500 mt-4'>*{error}</p>}

         <motion.button
         whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDocs}
          disabled={!isCompleted || loading}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
         >
         {loading?<CircleDashed className='text-white animate-spin'/>: "Continue"}
     
         </motion.button>




      </motion.div>
    </div>
  )
}

export default page
