import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { resetConnectionData, toggleSidebar } from '../redux/slices/connectionDataSlice'
import { showSuccessToast } from '../ui/Toasts'
import { ROLES } from '../utility/constants'
import DangerModal from './modals/confirmationModals/DangerModal'
import { MdCoPresent, MdLogout } from 'react-icons/md'
import { VscDebugRestart } from 'react-icons/vsc'
import { FaRegWindowClose } from 'react-icons/fa'
import { BsGraphUpArrow } from 'react-icons/bs'
import { closeModal, openModal, toggleModal } from '../redux/slices/modalSlice'
const { ipcRenderer } = window.require('electron')

function Sidebar() {
  const dispatch = useDispatch()
  const isSidebarOpen = useSelector((state) => state.connectionData.isSidebarOpen)

  const role = useSelector((state) => state.connectionData.role)

  return (
    <>
      

      <div
        className={` h-screen bg-gray-800 absolute top-0 z-50 text-white w-64 py-4 px-2  ${isSidebarOpen ? '' : 'hidden'}`}
      >
        <ul className="flex flex-col gap-3">
          {role === ROLES.BIOMETRIC_CANDIDATE_ATTENDANCE && (
            <NavLink
              onClick={() => dispatch(toggleSidebar(false))}
              to={'/candidate-attendance'}
              className={({ isActive }) =>
                `cursor-pointer hover:bg-gray-700 flex items-center gap-2 py-3 px-2 ${isActive ? 'bg-gray-600' : ''}`
              }
            >
              <MdCoPresent />
              <span>Candidate Attendance</span>
            </NavLink>
          )}

          {role === ROLES.BIOMETRIC_STAFF_ATTENDANCE && (
            <NavLink
              onClick={() => dispatch(toggleSidebar(false))}
              to={'/staff-attendance'}
              className={({ isActive }) =>
                `cursor-pointer hover:bg-gray-700 flex items-center gap-2 py-3 px-2 ${isActive ? 'bg-gray-600' : ''}`
              }
            >
              Staff Attendance
            </NavLink>
          )}

          {role === ROLES.BIOMETRIC_CANDIDATE_ATTENDANCE && (
            <li
              onClick={() => dispatch(openModal('fullDayAttendance'))}
              className={`cursor-pointer hover:bg-gray-700 flex items-center gap-2 py-3 px-2`}

            >
              <BsGraphUpArrow />
              <span>Full Day Attendance</span>
            </li>
          )}

          <li
            className="cursor-pointer hover:bg-gray-700 flex items-center gap-2 py-3 px-2"
            onClick={(e) => {
              e.preventDefault()
              dispatch(openModal('logoutModal'))
            }}
          >
            <MdLogout />
            Logout
          </li>

          <li
            className="cursor-pointer hover:bg-gray-700 flex items-center gap-2 py-3 px-2"
            onClick={(e) => {
              console.log(1)
              showSuccessToast('App is restarting...', 'restart-app')
              ipcRenderer.send('restart-app')
            }}
          >
            <VscDebugRestart />

            <span>Restart App</span>
          </li>

          <li
            className="cursor-pointer hover:bg-gray-700 flex items-center gap-2 py-3 px-2"
            onClick={(e) => {
              e.preventDefault()
              dispatch(toggleSidebar(false))
            }}
          >
            <FaRegWindowClose />
            <span>Close</span>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Sidebar
