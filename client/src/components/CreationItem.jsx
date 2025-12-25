import React, { useState } from 'react'
import Markdown from 'react-markdown'

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false)

  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString("en-IN")
    : "—"

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'
    >
      <div className='flex justify-between items-center gap-4'>
        <div>
          <h2>{item.prompt}</h2>
          <p className='text-gray-500'>
            {item.type} - {formattedDate}
          </p>
        </div>
        <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full'>
          {item.type}
        </button>
      </div>

      {expanded && (
  <div className="mt-3">
    {/* IMAGE & OBJECT REMOVE */}
    {(item.type === 'image' || item.type === 'object-remove') && (
      <img
        src={item.content}
        alt={item.type}
        className="w-full max-w-md rounded"
      />
    )}

    {/* RESUME REVIEW */}
    {item.type === 'resume-review' && (
      <div className="text-slate-700">
        <Markdown>{item.content}</Markdown>
      </div>
    )}

    {/* ARTICLE / BLOG */}
    {(item.type === 'article' || item.type === 'blog-title') && (
      <div className="text-slate-700 reset-tw">
        <Markdown>{item.content}</Markdown>
      </div>
    )}
  </div>
)}

    </div>
  )
}

export default CreationItem
