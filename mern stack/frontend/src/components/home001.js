import React from 'react'
import Navbar from './Navbar'
import './Home001.css'
const Home001 = () => {
  return (
    <div>
        <Navbar/>
        <div className='dashboard'>
          <p style={{color:"rgba(3,68,124,255)",fontSize:30, fontWeight:800}}>Dashboard</p>
        </div>
    </div>
  )
}

export default Home001