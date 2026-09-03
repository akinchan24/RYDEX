import { a } from 'motion/react-client'
import React from 'react'

function DocPreview({label,url}:any) {
    const isImage=url?.match(/\.(jpg|jpeg|png|webp)$/i)
    const isPdf=url?.endsWith(".pdf")
  return (
    <div className='bg-gray-50 rounded-2xl border overflow-hidden shadow-sm'>
      <div className='px-4 py-2 border-b text-sm font-semibold'>
        {label}
      </div>
      <div className='h-52 flex items-center justify-center bg-white'>
{!url && <span className='text-xs text-gray-400'>Image Not Uploaded</span>}

{isImage && <img src={url} className='w-full h-full object-cover'/>}

{isPdf && <iframe src={url} className='w-full h-full'/>}

      </div>
      {url && (
    <a
    href={url}
    target="_blank"
    className="block text-center text-xs py-2 font-medium hover:bg-gray-100"
    >Open Full Document</a>
)}
      
    </div>
  )
}

export default DocPreview
