'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { CircleDashed, Lock, Mail, User, X } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'

import { signIn, useSession } from 'next-auth/react'
type propType = {
    open: boolean,
    onClose: () => void
}
type stepType = "login" | "signup" | "otp" | "forgot-password" | "reset-password"
function AuthModal({ open, onClose }: propType) {
    const [step, setStep] = useState<stepType>("login")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState("")
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [resetPassword, setResetPassword] = useState("")

    const session = useSession()
    console.log(session)
    const handleSignUp = async () => {
        setLoading(true)
        try {
            await axios.post("/api/auth/register", {
                name, email, password
            })
           setErr("")
            setStep("otp")
            setLoading(false)
        } catch (error: unknown) {
            setLoading(false)
            setErr(axios.isAxiosError(error) ? error.response?.data?.message ?? "something went wrong" : "something went wrong")
        }
    }
    const handleVerifyEmail = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/auth/verify-email", {
                email,otp:otp.join("")
            })
           console.log(data)
           setOtp(["", "", "", "", "", ""])
           setErr("")
            setStep("login")
            setLoading(false)
        } catch (error: unknown) {
            setLoading(false)
            setErr(axios.isAxiosError(error) ? error.response?.data?.message ?? "something went wrong" : "something went wrong")
        }
    }

    const handleLogin = async () => {
  setLoading(true)
  setErr("")

  const res = await signIn("credentials", {
    email,
    password,
    redirect: false
  })

  setLoading(false)

    if (res?.error) {
    setErr("Invalid email or password")
    return
  }

  if (res?.ok) {
    onClose()
  }
}

    const handleForgotPassword = async () => {
        setLoading(true)
        setErr("")
        try {
            await axios.post("/api/auth/forgot-password", { email })
            setStep("reset-password")
        } catch (error: unknown) {
            setErr(axios.isAxiosError(error) ? error.response?.data?.message ?? "something went wrong" : "something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async () => {
        setLoading(true)
        setErr("")
        try {
            await axios.post("/api/auth/reset-password", {
                email,
                otp: otp.join(""),
                password: resetPassword
            })
            setOtp(["", "", "", "", "", ""])
            setResetPassword("")
            setPassword("")
            setStep("login")
        } catch (error: unknown) {
            setErr(axios.isAxiosError(error) ? error.response?.data?.message ?? "something went wrong" : "something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        await signIn("google",{
            callbackUrl:"/"
        })
    }

    const handleChangeOtp=(index:number,value:string)=>{
        if (!/^[0-9]?$/.test(value)) return
        const updated=[...otp]
        updated[index]=value
        setOtp(updated)

        if(value && index<otp.length-1){
            document.getElementById(`otp-${index+1}`)?.focus()
        }
        if(!value && index>0){
            document.getElementById(`otp-${index-1}`)?.focus()
        }
    }


    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                        >
                            <div className='relative w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] p-6 sm:p-8 text-black'>
                                <div className='absolute right-4 top-4 text-gray-500 hover:text-black transition' onClick={onClose}>
                                    <X size={20} />
                                </div>
                                <div className='mb-6 text-center'>
                                    <h1 className='text-3xl font-extrabold tracking-widest'>RYDEX</h1>
                                    <p className='mt-1 text-xs text-gray-500'>Premium Vehicle Booking</p>
                                </div>

                                <button className=' w-full h-11 rounded-xl
                  border border-black/20
                  flex items-center justify-center gap-3
                  text-sm font-semibold
                  hover:bg-black hover:text-white
                  transition' onClick={handleGoogleLogin}>
                                    <Image src="/google.png" alt='Google' width={20} height={20} />
                                    Continue with Google
                                </button>

                                <div className='flex items-center gap-4 my-6'>
                                    <div className='flex-1 h-px bg-black/10' />
                                    <div className='text-xs text-gray-500'>OR</div>
                                    <div className='flex-1 h-px bg-black/10' />
                                </div>
                                <div>
                                    {step == "login" && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}

                                        >
                                            <h1 className='text-xl font-semibold' >Welcome back</h1>
                                            <div className='mt-5 space-y-4'>
                                                <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                                                    <Mail size={18} className='text-gray-500' />
                                                    <input type="email" placeholder='Email' className='w-full bg-transparent outline-none text-sm' onChange={(e) => setEmail(e.target.value)} value={email} />
                                                </div>
                                                <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                                                    <Lock size={18} className='text-gray-500' />
                                                    <input type="password" placeholder='Password' className='w-full bg-transparent outline-none text-sm' onChange={(e) => setPassword(e.target.value)} value={password} />
                                                </div>
                                                 {err && (
                                                    <p className='text-red-500 text-sm'>
                                                    *{err}
                                                    </p>
                                                 )}
                                                <button className='w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex justify-center items-center' onClick={handleLogin}>{!loading ? "Login" : <CircleDashed size={18} color='white' className='animate-spin' />}</button>
                                                <button type="button" className='w-full text-sm text-gray-500 hover:text-black hover:underline' onClick={() => { setErr(""); setStep("forgot-password") }}>Forgot password?</button>

                                            </div>
                                            <p className='mt-6 text-center text-sm text-gray-500'> Don&apos;t have an account? <span onClick={() => setStep("signup")} className='text-black font-medium hover:underline cursor-pointer'>Sign Up</span></p>

                                        </motion.div>
                                    )}
                                    {step == "signup" && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}

                                        >
                                            <h1 className='text-xl font-semibold' >Create Account</h1>
                                            <div className='mt-5 space-y-4'>
                                                <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                                                    <User size={18} className='text-gray-500' />
                                                    <input type="text" placeholder='Full Name' className='w-full bg-transparent outline-none text-sm' onChange={(e) => setName(e.target.value)} value={name} />
                                                </div>
                                                <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                                                    <Mail size={18} className='text-gray-500' />
                                                    <input type="email" placeholder='Email' className='w-full bg-transparent outline-none text-sm' onChange={(e) => setEmail(e.target.value)} value={email} />
                                                </div>
                                                <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                                                    <Lock size={18} className='text-gray-500' />
                                                    <input type="password" placeholder='Password' className='w-full bg-transparent outline-none text-sm' onChange={(e) => setPassword(e.target.value)} value={password} />
                                                </div>

                                                {err && <p className='text-red-500 '>*{err}</p>}

                                                <button className='w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex justify-center items-center' disabled={loading} onClick={handleSignUp}>{!loading ? "Send Otp" : <CircleDashed size={18} color='white' className='animate-spin' />}</button>

                                            </div>
                                            <p className='mt-6 text-center text-sm text-gray-500'> Already have an account? <span onClick={() => setStep("login")} className='text-black font-medium hover:underline cursor-pointer'>Login</span></p>

                                        </motion.div>
                                    )}

                                    {step == "otp" && (
                                        <motion.div
                                            key="otp"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h2 className='text-xl font-semibold'>Verify Email</h2>

                                            <div className='mt-6 flex justify-between gap-2'>
                                              {otp.map((digit,i)=>(
                                                <input 
                                                key={i} 
                                                id={`otp-${i}`}
                                                value={digit}
                                                maxLength={1}
                                               className='w-10 h-12 sm:w-12
                            text-center text-lg font-semibold
                            rounded-xl bg-white
                            border border-black/20
                            outline-none'
                            onChange={(e)=>handleChangeOtp(i,e.target.value)}
                                            
                                            />
                                            
                                              ))}

                                            </div>
                                            
                                                {err && <p className='text-red-500 '>*{err}</p>}
                                            <button className='mt-6 w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 flex justify-center items-center transition' onClick={handleVerifyEmail}>{!loading ? "Verify OTP and Create Account" : <CircleDashed size={18} color='white' className='animate-spin' />}</button>

                                        </motion.div>
                                    )}

                                    {step == "forgot-password" && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <h1 className='text-xl font-semibold'>Forgot password?</h1>
                                            <p className='mt-2 text-sm text-gray-500'>Enter your email and we will send you a reset code.</p>
                                            <div className='mt-5 space-y-4'>
                                                <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                                                    <Mail size={18} className='text-gray-500' />
                                                    <input type="email" placeholder='Email' className='w-full bg-transparent outline-none text-sm' onChange={(e) => setEmail(e.target.value)} value={email} />
                                                </div>
                                                {err && <p className='text-red-500 text-sm'>*{err}</p>}
                                                <button className='w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex justify-center items-center' disabled={loading} onClick={handleForgotPassword}>{!loading ? "Send reset code" : <CircleDashed size={18} color='white' className='animate-spin' />}</button>
                                            </div>
                                            <p className='mt-6 text-center text-sm text-gray-500'><span onClick={() => { setErr(""); setStep("login") }} className='text-black font-medium hover:underline cursor-pointer'>Back to login</span></p>
                                        </motion.div>
                                    )}

                                    {step == "reset-password" && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <h1 className='text-xl font-semibold'>Reset password</h1>
                                            <p className='mt-2 text-sm text-gray-500'>Enter the six-digit code sent to your email.</p>
                                            <div className='mt-5 space-y-4'>
                                                <div className='flex justify-between gap-2'>
                                                    {otp.map((digit, i) => (
                                                        <input key={i} id={`otp-${i}`} value={digit} maxLength={1} inputMode="numeric" className='w-10 h-12 sm:w-12 text-center text-lg font-semibold rounded-xl bg-white border border-black/20 outline-none' onChange={(e) => handleChangeOtp(i, e.target.value)} />
                                                    ))}
                                                </div>
                                                <div className='flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3'>
                                                    <Lock size={18} className='text-gray-500' />
                                                    <input type="password" placeholder='New password' className='w-full bg-transparent outline-none text-sm' onChange={(e) => setResetPassword(e.target.value)} value={resetPassword} />
                                                </div>
                                                {err && <p className='text-red-500 text-sm'>*{err}</p>}
                                                <button className='w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex justify-center items-center' disabled={loading} onClick={handleResetPassword}>{!loading ? "Reset password" : <CircleDashed size={18} color='white' className='animate-spin' />}</button>
                                            </div>
                                            <p className='mt-6 text-center text-sm text-gray-500'><span onClick={() => { setErr(""); setStep("login") }} className='text-black font-medium hover:underline cursor-pointer'>Back to login</span></p>
                                        </motion.div>
                                    )}
                                </div>



                            </div>

                        </motion.div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>

    )
}

export default AuthModal
