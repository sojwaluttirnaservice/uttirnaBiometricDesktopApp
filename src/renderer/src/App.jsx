import { useEffect, useRef } from 'react'
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CheckConnectionModal from './components/modals/CheckConnectionModal'
import Navbar from './components/navbar/Navbar'
import './index.css'
import CandidateAttendance from './pages/candidate/CandidateAttendance'
import StaffAttendance from './pages/candidate/StaffAttendance'
import StatusBar from './components/navbar/StatusBar'
import { FullDayAttendanceModal } from './components/candidate/attendancdInfo/FullDayAttendanceModal'
import { closeModal, toggleModal } from './redux/slices/modalSlice'
import { resetConnectionData } from './redux/slices/connectionDataSlice'
import DangerModal from './components/modals/confirmationModals/DangerModal'

const App = () => {
  let inputRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const connectionData = useSelector((state) => state.connectionData)
  const { fullDayAttendance: isFullDayAttendanceModalOpen, logoutModal: isLogoutModalOpen } = useSelector((state) => state.modals)

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

            {/* Full day attendance report modal */}
            <FullDayAttendanceModal
              isOpen={isFullDayAttendanceModalOpen}
              onClose={() => dispatch(toggleModal('fullDayAttendance'))}
              isScrollable={true}
              title={'Full Day Attendance'}
            />

            {/* Modals for logout asking */}
            <DangerModal
              isOpen={isLogoutModalOpen}
              onConfirm={() => {
                dispatch(toggleModal('logoutModal'))
                dispatch(resetConnectionData())
              }}
              confirmButtonName={'Logout'}
              title="Logout"
              message="Are you sure you want to log out?"
            />
            <Outlet />
            <StatusBar />
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
