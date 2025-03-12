import React from 'react'
import SellerLayout from './layout'
import SellerHeader from './header'
import { Outlet } from 'react-router-dom'
const SellerLayout = () => {
  return (
    <div>
        seller layout
        <div>
            <SellerLayout />
        </div>
        <div>
            <SellerHeader />
        </div>
        <div>
            <Outlet />
        </div>
    </div>
  )
}

export default SellerLayout
