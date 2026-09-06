'use client'
import axios from 'axios'
import { Banknote, BarChart2, CreditCard, Star, TrendingDown, TrendingUp, Wallet, Zap } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type Earning = {
    date: string,
    earnings: number
}
function PartnerEarning() {
    const [earningData, setEarningData] = useState<Earning[]>([])
    const [pendingAppPayment, setPendingAppPayment] = useState(0)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [onlineReceived, setOnlineReceived] = useState(0)
    const [cashReceived, setCashReceived] = useState(0)
    const [withdrawableOnline, setWithdrawableOnline] = useState(0)
    const [withdrawalLoading, setWithdrawalLoading] = useState(false)
    useEffect(() => {
        const fetchEarning = async () => {
            try {
                const [{ data }, { data: dueData }] = await Promise.all([
                    axios.get("/api/partner/earning"),
                    axios.get("/api/partner/payment-due"),
                ])
                const last7DaysData: Earning[] = data.earnings.slice(-7)
                setEarningData(last7DaysData)
                setPendingAppPayment(dueData.pendingAppPayment ?? 0)
                setOnlineReceived(data.onlineReceived ?? 0)
                setCashReceived(data.cashReceived ?? 0)
                setWithdrawableOnline(data.withdrawableOnline ?? 0)
            } catch (error) {
                console.log(error)
            }
        }
        fetchEarning()
    }, [])

    const loadRazorpayScript = () => new Promise<boolean>((resolve) => {
        if (typeof window === "undefined") {
            resolve(false)
            return
        }
        if ((window as any).Razorpay) {
            resolve(true)
            return
        }
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })

    const handlePayToApp = async () => {
        if (pendingAppPayment <= 0 || paymentLoading) return
        setPaymentLoading(true)
        try {
            const razorpayLoaded = await loadRazorpayScript()
            if (!razorpayLoaded) {
                alert("Razorpay failed to load. Please try again.")
                return
            }

            const { data: order } = await axios.post("/api/partner/payment/create")
            const paymentObject = new (window as any).Razorpay({
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "RYDEX",
                description: "Partner commission payment",
                order_id: order.orderId,
                handler: async (response: any) => {
                    try {
                        const { data } = await axios.post("/api/partner/payment/verify", response)
                        if (!data.success) {
                            throw new Error(data.message)
                        }
                        setPendingAppPayment(data.pendingAppPayment ?? 0)
                        alert("Payment received. Your app balance is updated.")
                    } catch (error) {
                        console.log(error)
                        alert("Payment verification failed. Please contact support.")
                    }
                },
                modal: {
                    ondismiss: () => setPaymentLoading(false),
                },
            })
            paymentObject.open()
        } catch (error) {
            console.log(error)
            alert("Payment could not be completed. Please try again.")
        } finally {
            setPaymentLoading(false)
        }
    }

    const handleWithdraw = async () => {
        if (withdrawableOnline <= 0 || withdrawalLoading) return
        setWithdrawalLoading(true)
        try {
            await axios.post("/api/partner/withdrawals", { amount: withdrawableOnline })
            setWithdrawableOnline(0)
            alert("Withdrawal request sent. Admin will process it to your verified bank account.")
        } catch (error: any) {
            alert(error.response?.data?.message ?? "Withdrawal request failed. Please try again.")
        } finally {
            setWithdrawalLoading(false)
        }
    }


    const total = earningData.reduce((a, d) => a + d.earnings, 0)
    const avg = earningData.length ? Math.round(total / earningData.length) : 0
    const max = earningData.length ? Math.max(...earningData.map((d) => d.earnings)) : 0
    const bestDay = earningData.find(d => d.earnings === max)
    const today = earningData[earningData.length - 1]
    const yesterDay = earningData[earningData.length - 2]
    const delta = today && yesterDay ? today.earnings - yesterDay.earnings : 0
    const deltaPositive = delta >= 0
    const deltaPct = yesterDay ? Math.abs(Math.round((delta / yesterDay.earnings) * 100)) : 0;


    const fmt = (n: number) => {
        return "₹" + n.toLocaleString()
    }

    const metrics = [
        {
            label: "Best Day",
            value: fmt(max),
            sub: bestDay?.date ?? "—",
            icon: <Star size={14} />,
            color: "text-violet-600",
            bg: "bg-violet-50",
        },
        {
            label: "Daily Avg",
            value: fmt(avg),
            sub: "per day",
            icon: <BarChart2 size={14} />,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Today",
            value: today ? fmt(today.earnings) : "—",
            sub: today && yesterDay
                ? `${deltaPositive ? "+" : ""}${fmt(delta)} vs yesterday`
                : "—",
            icon: <Zap size={14} />,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
    ];


    return (
        <div className='bg-white rounded-2xl border border-gray-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] p-5 sm:p-6 w-full'>
            <div className='flex items-start justify-between mb-6 flex-wrap gap-4'>
                <div>
                    <span className='inline-block text-[11px] font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2'>
                        Earnings
                    </span>
                    <h2 className='text-xl font-bold text-gray-900 tracking-tight'>Income overview</h2>
                    <p className='text-sm text-gray-500 mt-1'>
                        Last 7 days performance
                    </p>
                </div>
                <div className='text-right'>
                    <p className='text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1'>
                        Weekly total
                    </p>
                    <motion.div
                        key={total}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-gray-900 font-mono tracking-tight"
                    >
                        {fmt(total)}
                    </motion.div>

                    <div className={`flex items-center justify-end gap-1 text-xs font-semibold mt-1 ${deltaPositive ? "text-emerald-600" : "text-rose-500"
                        }`}>
                        {deltaPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        <span>{deltaPct}% vs yesterday</span>

                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7'>
                {metrics.map((m, i) => (
                    <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        className={`bg-gray-50 rounded-2xl p-4 ${m.label === "Pay to app" && pendingAppPayment > 0 ? "cursor-pointer hover:bg-rose-50 transition-colors" : ""}`}
                        onClick={m.label === "Pay to app" ? handlePayToApp : undefined}
                    >

                        <div className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-2 ${m.color}`}>
                            <span className={`${m.bg} p-1 rounded-lg ${m.color}`}>{m.icon}</span>
                            {m.label}
                        </div>
                        <p className='text-lg font-bold text-gray-900 font-mono leading-none'>{m.value}</p>
                        <p className='text-[11px] text-gray-400 mt-1'>{m.sub}</p>
                        {m.label === "Pay to app" && pendingAppPayment > 0 && (
                            <p className='text-[11px] font-semibold text-rose-600 mt-2'>
                                {paymentLoading ? "Opening payment..." : "Click to pay"}
                            </p>
                        )}

                    </motion.div>
                ))}
            </div>
            <div className='border-t border-gray-100 pt-6'>
                <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4'>
                    <div>
                        <p className='text-xs font-bold uppercase tracking-[0.18em] text-gray-400'>Payment center</p>
                        <h3 className='text-lg font-bold text-gray-900 mt-1'>Received and available funds</h3>
                    </div>
                    <p className='text-xs text-gray-500'>Online funds can be requested to your verified bank.</p>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                <div className='rounded-2xl border border-blue-100 bg-blue-50/60 p-4'>
                    <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700'>
                        <Wallet size={15} /> Online received
                    </div>
                    <p className='mt-2 text-xl font-bold text-gray-900 font-mono'>{fmt(onlineReceived)}</p>
                    <p className='mt-1 text-xs text-gray-500'>Eligible for bank withdrawal</p>
                    <button
                        type='button'
                        onClick={handleWithdraw}
                        disabled={withdrawableOnline <= 0 || withdrawalLoading}
                        className='mt-3 w-full rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300'
                    >
                        {withdrawalLoading ? "Requesting..." : withdrawableOnline > 0 ? `Withdraw ${fmt(withdrawableOnline)}` : "No amount available"}
                    </button>
                </div>
                <div className='rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4'>
                    <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700'>
                        <Banknote size={15} /> Cash received
                    </div>
                    <p className='mt-2 text-xl font-bold text-gray-900 font-mono'>{fmt(cashReceived)}</p>
                    <p className='mt-1 text-xs text-gray-500'>90% partner share from cash rides</p>
                </div>
                <div
                    onClick={handlePayToApp}
                    className={`rounded-2xl border border-rose-100 bg-rose-50/60 p-4 ${pendingAppPayment > 0 ? "cursor-pointer hover:bg-rose-100/70 transition-colors" : ""}`}
                >
                    <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700'>
                        <CreditCard size={15} /> Pay to app
                    </div>
                    <p className='mt-2 text-xl font-bold text-gray-900 font-mono'>{fmt(pendingAppPayment)}</p>
                    <p className='mt-1 text-xs text-gray-500'>10% cash commission due to RYDEX</p>
                    {pendingAppPayment > 0 && <p className='mt-3 text-xs font-bold text-rose-600'>{paymentLoading ? "Opening payment..." : "Click to pay"}</p>}
                </div>
                </div>
            </div>

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scaleY: 0.92 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="h-56 min-h-56"
                >
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart
                            data={earningData}
                            barCategoryGap={"30%"}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => "₹" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)}
                            />
                            <Bar
                                dataKey="earnings" radius={[8, 8, 3, 3]}
                            >
                                {earningData.map((d, i) => {

                                    const isToday = i === earningData.length - 1;
                                    const isBest = d.earnings === max && !isToday;
                                    return (
                                        <Cell
                                            key={`cell-${i}`}
                                            fill={
                                                isToday
                                                    ? "#10b981"
                                                    : isBest
                                                        ? "#8b5cf6"
                                                        : "#bfdbfe"
                                            }
                                        />
                                    )
                                })}

                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

            </AnimatePresence>


        </div>
    )
}

export default PartnerEarning
