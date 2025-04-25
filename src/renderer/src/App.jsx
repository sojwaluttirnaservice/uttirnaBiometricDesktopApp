import React, { useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, Outlet, useNavigate } from 'react-router-dom'

import CandidateAttendance from './pages/candidate/CandidateAttendance'
import Navbar from './components/navbar/Navbar'
import './index.css'
import CheckConnectionModal from './components/modals/CheckConnectionModal'
import { useSelector } from 'react-redux'
import StaffAttendance from './pages/candidate/StaffAttendance'

const Layout = () => {
  return (
    <div>
      <Outlet /> {/* This will render the nested routes */}
    </div>
  )
}

const App = () => {
  let inputRef = useRef(null)
  const navigate = useNavigate()
  const connectionData = useSelector((state) => state.connectionData)

  console.log(connectionData)

  useEffect(() => {
    if (connectionData.backendUrl == '' && connectionData.status != 'Connected') {
      navigate('/login')
    }
  }, [connectionData])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key?.toLowerCase() === 'k') {
        inputRef.current.focus()
      }
    }

    // Attach the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Try to remove the batch and lab
  // BEFORE LOADING THE APP, CLEANING UP THE LAB AND BATCH
  useEffect(() => {
    if (localStorage.getItem('lab')) localStorage.removeItem('lab')
    if (localStorage.getItem('batch')) localStorage.removeItem('batch')
  }, [])

  return (
    <Routes>
      <Route
        element={
          <>
            {/* This is root layout */}
            <Navbar ref={inputRef} />
            <Outlet />
          </>
        }
      >
        <Route path="/candidate-attendance" element={<CandidateAttendance ref={inputRef} />} />
        <Route path="/staff-attendance" element={<StaffAttendance ref={inputRef} />} />
      </Route>

      <Route path="/login" element={<CheckConnectionModal />} />
    </Routes>
  )
}

// Example pages

export default App

// {
//   connectionData.status != 'Connected' ? (
//     <>
//       <CheckConnectionModal />
//     </>
//   ) : (
//     <>
//       <Navbar ref={inputRef} /> {/* Navbar is now part of the Router */}
//       {<CandidateAttendance ref={inputRef} />}
//       {/* <Routes>
//     <Route path="/" element={<Layout />}>
//       <Route path='' element={<CandidateAttendance ref={inputRef} />} />
//     </Route>
//   </Routes> */}
//     </>
//   )
// }
