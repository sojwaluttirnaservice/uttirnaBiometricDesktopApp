import React, { act, useState } from 'react'
import { NavLink } from 'react-router-dom'
import DangerModal from './modals/confirmationModals/DangerModal'
import { useDispatch, useSelector } from 'react-redux'
import { resetConnectionData, toggleSidebar } from '../redux/slices/connectionDataSlice'

function Sidebar() {
  const dispatch = useDispatch()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const isSidebarOpen = useSelector((state) => state.connectionData.isSidebarOpen)

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
          <NavLink
            onClick={() => dispatch(toggleSidebar(false))}
            to={'/candidate-attendance'}
            className={({ isActive }) =>
              `cursor-pointer hover:bg-gray-700 py-3 px-2 ${isActive ? 'bg-gray-600' : ''}`
            }
          >
            Candidate Attendance
          </NavLink>

          <NavLink
            onClick={() => dispatch(toggleSidebar(false))}
            to={'/staff-attendance'}
            className={({ isActive }) =>
              `cursor-pointer hover:bg-gray-700 py-3 px-2 ${isActive ? 'bg-gray-600' : ''}`
            }
          >
            Staff Attendance
          </NavLink>

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
