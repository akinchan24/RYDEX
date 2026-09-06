'use client'
import axios from 'axios'
import { Activity, CheckCircle2, Clock, LogOut, Mail, Phone, Truck, User, Users, Video, XCircle } from 'lucide-react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Kpi from './Kpi'
import TabButton from './TabButton'
import { AnimatePresence } from 'motion/react'
import { motion } from "motion/react"
import ContentList from './ContentList'
import AdminEarning from './AdminEarning'
type Stats = {
  totalApprovedPartners: number
  totalPartners: number
  totalPendingPartners: number
  totalRejectedPartners: number
}

type Tab = "partner" | "kyc" | "vehicle"
type PartnerDue = {
  id: string
  name: string
  email: string
  mobileNumber: string
  pendingAppPayment: number
}
function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("partner")
  const [partnerReviews, setPartnerReviews] = useState<any>()
  const [pendingkyc, setPendingkyc] = useState<any>()
  const [vehicleReviews, setVehicleReviews] = useState<any>()
  const [appPayments, setAppPayments] = useState({ totalReceived: 0, paymentsCount: 0, partnersDue: [] as PartnerDue[] })
  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/" })
  }
  const handleGetData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard")
      setStats(data.stats)
      setPartnerReviews(data.pendingPartnersReviews)
      setVehicleReviews(data.pendingVehicles)
    } catch (error) {
      console.log(error)
    }
  }
  const handleGetPendingKYC = async () => {
    try {
      const { data } = await axios.get("/api/admin/video-kyc/pending")
      setPendingkyc(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetAppPayments = async () => {
    try {
      const { data } = await axios.get("/api/admin/app-payments")
      setAppPayments(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetPendingKYC()
    handleGetData()
    handleGetAppPayments()
  }, [])
  return (
    <div className='min-h-screen bg-[#f4f5f7] text-gray-950'>
      <div className='sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-200/80 z-40'>
        <div className='max-w-7xl mx-auto min-h-20 px-6 flex items-center justify-between gap-6'>
          <div className='flex items-center gap-3'>
            <div className='w-11 h-11 rounded-xl bg-gray-950 flex items-center justify-center shadow-sm'>
              <Image src={"/logo.png"} alt='logo' width={36} height={36} priority />
            </div>
            <div className='hidden sm:block'>
              <p className='text-sm font-bold tracking-tight'>RYDEX Operations</p>
              <p className='text-[11px] text-gray-500'>Administration workspace</p>
            </div>
          </div>

          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='hidden md:flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100'>
              <Activity size={14} />
              System active
            </div>
            <div className='flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-950 text-white'>
              <User size={14} />
              <span className='hidden sm:inline'>Admin Dashboard</span>
              <span className='sm:hidden'>Admin</span>
            </div>
            <button
              type='button'
              onClick={handleLogOut}
              className='flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition'
            >
              <LogOut size={14} />
              <span className='hidden sm:inline'>Logout</span>
            </button>
          </div>
        </div>
      </div>
      <main className='max-w-7xl mx-auto px-6 py-10 lg:py-12 space-y-10'>
        <section className='flex flex-col lg:flex-row lg:items-end justify-between gap-5'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-3'>Overview</p>
            <h1 className='text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-gray-950'>Good to see you, Admin.</h1>
            <p className='mt-2 text-sm text-gray-500 max-w-xl'>Monitor partner onboarding, vehicle approvals, and identity verification from one place.</p>
          </div>
          <div className='text-left lg:text-right'>
            <p className='text-xs font-semibold uppercase tracking-widest text-gray-400'>Workspace status</p>
            <p className='mt-1 text-sm font-semibold text-gray-800'>Live operations overview</p>
            <p className='mt-2 text-xs text-gray-500'>Payments received from partners: <span className='font-bold text-gray-900'>₹{appPayments.totalReceived.toLocaleString()}</span></p>
          </div>
        </section>

        <section>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-base font-bold text-gray-900'>Partner network</h2>
              <p className='text-xs text-gray-500 mt-1'>Current account approval pipeline</p>
            </div>
            <span className='text-xs font-medium text-gray-400'>Updated live</span>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          <Kpi label="Total Partners" value={stats?.totalPartners} icon={<Users />} variant={"totalPartners"} />
          <Kpi label="Approved Partners" value={stats?.totalApprovedPartners} icon={<CheckCircle2 />} variant={"approved"} />
          <Kpi label="Pending Partners" value={stats?.totalPendingPartners} icon={<Clock />} variant={"pending"} />
          <Kpi label="Rejected Partners" value={stats?.totalRejectedPartners} icon={<XCircle />} variant={"rejected"} />
          </div>
        </section>

        <section className='bg-white rounded-2xl border border-gray-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.05)] p-4 sm:p-6'>
          <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.18em] text-blue-600 mb-2'>Action center</p>
              <h2 className='text-xl font-bold tracking-tight text-gray-900'>Review queues</h2>
              <p className='text-sm text-gray-500 mt-1'>Work through the items that need your attention.</p>
            </div>
            <span className='text-xs text-gray-400'>Select a queue to continue</span>
          </div>

          <div className='bg-gray-50 rounded-xl p-1.5 border border-gray-100 flex flex-wrap gap-1.5'>
            <TabButton
              active={activeTab == "partner"}
              count={partnerReviews?.length ?? 0}
              icon={<Users size={15} />}
              onClick={() => setActiveTab("partner")}
            >
              Pending Partner Reviews
            </TabButton>

            <TabButton
              active={activeTab == "kyc"}
              count={pendingkyc?.length ?? 0}
              icon={<Video size={15} />}
              onClick={() => setActiveTab("kyc")}
            >
              Pending Video KYC
            </TabButton>

            <TabButton
              active={activeTab == "vehicle"}
              count={vehicleReviews?.length ?? 0}
              icon={<Truck size={15} />}
              onClick={() => setActiveTab("vehicle")}
            >
              Pending Vehicle Reviews
            </TabButton>
          </div>

          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-6 space-y-3"
            >
              {activeTab=="partner"&& <ContentList data={partnerReviews ?? []} type={"partner"}/>}
              {activeTab=="kyc"&& <ContentList data={pendingkyc ?? []} type={"kyc"}/>}
              {activeTab=="vehicle"&& <ContentList data={vehicleReviews ?? []} type={"vehicle"}/>}
            </motion.div>
          </AnimatePresence>
        </section>

        <section>
          <div className='flex items-end justify-between mb-4'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 mb-2'>Performance</p>
              <h2 className='text-xl font-bold tracking-tight text-gray-900'>Earnings overview</h2>
            </div>
            <span className='text-xs text-gray-400'>Last 7 days</span>
          </div>
          <AdminEarning/>
        </section>

        <section className='bg-white rounded-2xl border border-gray-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.05)] overflow-hidden'>
          <div className='p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-3'>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.18em] text-rose-600 mb-2'>Collections</p>
              <h2 className='text-xl font-bold tracking-tight text-gray-900'>Partner amounts due</h2>
              <p className='text-sm text-gray-500 mt-1'>Cash-ride commissions awaiting payment to RYDEX.</p>
            </div>
            <div className='text-left sm:text-right'>
              <p className='text-xs text-gray-400'>Partners with outstanding balance</p>
              <p className='text-lg font-bold text-gray-900'>{appPayments.partnersDue.length}</p>
            </div>
          </div>

          {appPayments.partnersDue.length === 0 ? (
            <div className='p-10 text-center text-sm text-gray-500'>No partner payments are currently due.</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[680px] text-left'>
                <thead className='bg-gray-50 text-[11px] uppercase tracking-widest text-gray-400'>
                  <tr>
                    <th className='px-6 py-3 font-semibold'>Partner</th>
                    <th className='px-6 py-3 font-semibold'>Contact</th>
                    <th className='px-6 py-3 font-semibold text-right'>Amount due</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {appPayments.partnersDue.map((partner) => (
                    <tr key={partner.id} className='hover:bg-gray-50/80 transition-colors'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold'>
                            {partner.name.charAt(0).toUpperCase()}
                          </div>
                          <span className='font-semibold text-sm text-gray-900'>{partner.name}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='space-y-1 text-xs text-gray-500'>
                          <p className='flex items-center gap-2'><Mail size={13} />{partner.email}</p>
                          <p className='flex items-center gap-2'><Phone size={13} />{partner.mobileNumber}</p>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-right font-bold text-rose-600'>
                        ₹{partner.pendingAppPayment.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>


    </div>
  )
}

export default AdminDashboard
