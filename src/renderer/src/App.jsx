import { useEffect, useRef } from 'react'
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import CheckConnectionModal from './components/modals/CheckConnectionModal'
import Navbar from './components/navbar/Navbar'
import './index.css'
import CandidateAttendance from './pages/candidate/CandidateAttendance'
import StaffAttendance from './pages/candidate/StaffAttendance'

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
