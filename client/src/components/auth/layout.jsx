import React from 'react'
import { Outlet } from 'react-router-dom'

const Authlayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="bg-black text-white text-2xl w-1/2 flex items-center justify-center">
        <h1>Welcome to Smart Booking</h1>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  )
}

export default Authlayout
