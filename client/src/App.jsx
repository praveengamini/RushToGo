import React from 'react'
import { Button } from './components/ui/button'
import { Router,Route,Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Authlayout from './components/auth/layout'
import TicketForm from './Form'
import TicketList from './AllTickets'
import Modal from 'react-modal';
import Redirect from './pages/auth/Redirect'
import MovieImageSearch from './MoivePosture'
import { useNavigate } from 'react-router-dom'
Modal.setAppElement('#root'); 
const App = () => {
  const navigate = useNavigate();
  return (
     <div >
      <div className='flex  gap-12 '>

     <button onClick={(event)=>{navigate('/form')}} className='w-32 h-16 bg-black text-white hover:bg-blue-700'>Click to upload ticket</button>
     <button onClick={(event)=>{navigate('/trend')}} className='w-32 h-16 bg-black text-white' >Click to view re sale tickets</button>
      </div>
     <Routes>

        <Route path='/form' element={<TicketForm />} />
        <Route path='/movie' element={<MovieImageSearch />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={< Register/>} />
        <Route  path='/trend' element={<TicketList />}/>
        <Route path="/redirect" element={<Redirect />} />

     </Routes>
     
    </div>
  )
}

export default App
