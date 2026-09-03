'use client '
import { AlertTriangle } from 'lucide-react'
import React from 'react'

function RejectionCard({title,reason,actionLabel,onAction}:any) {
  return (
    <div className='bg-red-50 
        border border-red-200 
        rounded-2xl md:rounded-3xl 
        p-5 sm:p-6 md:p-8 
        space-y-4'>
      <div className='flex items-center gap-2 text-red-600 font-semibold text-sm sm:text-base'>
        <AlertTriangle size={18}/>
        {title}
      </div>
      <div className='bg-white border rounded-xl p-4 text-sm sm:text-base'>
        {reason}
      </div>
      {onAction && (
        <button
        onClick={onAction}
        className=' w-full sm:w-auto
            px-6 
            py-2.5 
            bg-black 
            text-white 
            rounded-xl 
            text-sm sm:text-base
            font-medium
            hover:bg-gray-800 
            transition'
        >
{actionLabel || "retry"}
        </button>
      )}
    </div>
  )
}

export default RejectionCard
