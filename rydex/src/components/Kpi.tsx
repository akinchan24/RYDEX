'use client'
import React from 'react'
import {motion} from "motion/react"

const KPI_CONFIG: Record<string, {
  iconBg: string; iconColor: string; cardHover: string;
}> = {
  totalPartners: {
    iconBg: "bg-purple-50", 
    iconColor: "text-purple-700",
    cardHover: "hover:shadow-purple-100/60",
  },
  approved: {
    iconBg: "bg-blue-50",
     iconColor: "text-blue-800",
     cardHover: "hover:shadow-blue-100/60",
  },
  pending: {
    iconBg: "bg-amber-50", 
    iconColor: "text-amber-800",
    cardHover: "hover:shadow-amber-100/60",
  },
  rejected: {
    iconBg: "bg-red-50", 
    iconColor: "text-red-800",
    cardHover: "hover:shadow-red-100/60",
  },
};


function Kpi({label,value,icon,variant}:any) {

    const cfg=KPI_CONFIG[variant]
    console.log(cfg)
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
        cursor-default relative overflow-hidden group ${cfg.cardHover}`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
        rounded-2xl ${cfg.iconBg}`} style={{ zIndex: 0 }}/>
      <div className='relative z-10'>
        <motion.div
        whileHover={{ rotate: -6, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${cfg.iconBg} ${cfg.iconColor}`}
        
        >
{icon}
        </motion.div>

        <p className='text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1'>{label}</p>

        <motion.div
          className="text-3xl font-extrabold text-gray-950 leading-tight"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {value}
        </motion.div>
        
        </div> 
      
    </motion.div>
  )
}

export default Kpi
