import React, { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom'

import CandidateAttendance from './pages/candidate/CandidateAttendance'
import Navbar from './components/navbar/Navbar'
import './index.css'
import CheckConnectionModal from './components/modals/CheckConnectionModal'
import { useSelector } from 'react-redux'

const Layout = () => {
  return (
    <div>
      <Outlet /> {/* This will render the nested routes */}
    </div>
  )
}

const App = () => {
  let inputRef = useRef(null)
  const connectionData = useSelector((state) => state.connectionData)

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
    <Router>
      {connectionData.status != 'Connected' ? (
        <>
          <CheckConnectionModal />
        </>
      ) : (
        <>
          <Navbar ref={inputRef} /> {/* Navbar is now part of the Router */}
          {<CandidateAttendance ref={inputRef} />}
          {/* <Routes>
            <Route path="/" element={<Layout />}>
              <Route path='' element={<CandidateAttendance ref={inputRef} />} />
            </Route>
          </Routes> */}
        </>
      )}
    </Router>
  )
}

// Example pages

export default App
