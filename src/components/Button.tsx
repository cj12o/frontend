import React from 'react'

function Button({
    className='',
    value="button",
    ...props
}) {
  return (
    <button {...props} 
    className={`rounded p-2 bg-indigo-500 text-white shadow-md hover:shadow-xs hover:shadow-gray-800/90 transition duration-200  active:bg-blue-900 ${className}`} 
    >{value}</button>
  )
}

export default Button

