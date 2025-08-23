import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { resetConnectionData, toggleSidebar } from '../redux/slices/connectionDataSlice'
import { showSuccessToast } from '../ui/Toasts'
import { ROLES } from '../utility/constants'
import DangerModal from './modals/confirmationModals/DangerModal'
const { ipcRenderer } = window.require('electron')

function Sidebar() {
  const dispatch = useDispatch()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const isSidebarOpen = useSelector((state) => state.connectionData.isSidebarOpen)

  const role = useSelector((state) => state.connectionData.role)

  const sideBarRef = useRef(null)

  // useEffect(() => {
  //   function closeSidebar(e) {
  //     if (sideBarRef.current && !sideBarRef.current.contains(e.target) && !isSidebarOpen) {
  //       dispatch(toggleSidebar(false))
  //     }
  //   }

  //   window.addEventListener('click', closeSidebar)

  //   return () => window.removeEventListener('click', closeSidebar)
  // }, [])

  return (
    <>
      {/* Modals for logout asking */}
      <DangerModal
        isOpen={isLogoutModalOpen}
        setIsOpen={setIsLogoutModalOpen}
        onConfirm={(e) => {
          e.preventDefault()
          dispatch(resetConnectionData())
        }}
        confirmButtonName={'Confirm Logout'}
        title="Logout"
        message="Are you sure you want to log out?"
      />

      <div
        className={` h-screen bg-gray-800 absolute top-0 z-50 text-white w-64 py-4 px-2  ${isSidebarOpen ? '' : 'hidden'}`}
      >
        <ul className="flex flex-col gap-3">
          {role === ROLES.BIOMETRIC_CANDIDATE_ATTENDANCE && (
            <NavLink
              onClick={() => dispatch(toggleSidebar(false))}
              to={'/candidate-attendance'}
              className={({ isActive }) =>
                `cursor-pointer hover:bg-gray-700 py-3 px-2 ${isActive ? 'bg-gray-600' : ''}`
              }
            >
              Candidate Attendance
            </NavLink>
          )}

          {role === ROLES.BIOMETRIC_STAFF_ATTENDANCE && (
            <NavLink
              onClick={() => dispatch(toggleSidebar(false))}
              to={'/staff-attendance'}
              className={({ isActive }) =>
                `cursor-pointer hover:bg-gray-700 py-3 px-2 ${isActive ? 'bg-gray-600' : ''}`
              }
            >
              Staff Attendance
            </NavLink>
          )}

          <li
            className="cursor-pointer hover:bg-gray-700 py-3 px-2"
            onClick={(e) => {
              e.preventDefault()
              setIsLogoutModalOpen(true)
            }}
          >
            Logout
          </li>

          <li
            className="cursor-pointer hover:bg-gray-700 py-3 px-2"
            onClick={(e) => {
              console.log(1)
              showSuccessToast('App is restarting...', 'restart-app')
              ipcRenderer.send('restart-app')
            }}
          >
            Restart App
          </li>

          <li
            className="cursor-pointer hover:bg-gray-700 py-3 px-2"
            onClick={(e) => {
              e.preventDefault()
              dispatch(toggleSidebar(false))
            }}
          >
            Close
          </li>
        </ul>
      </div>
    </>
  )
}

export default Sidebar
