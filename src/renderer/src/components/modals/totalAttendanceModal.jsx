import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { showSuccessToast, showWarningToast } from '../../ui/Toasts'
import { useDispatch } from 'react-redux'
import { setConnectionData } from '../../redux/slices/connectionDataSlice'

const TotalAttendanceModal = ({ isOpen, setIsOpen, onClose }) => {
  const dispatch = useDispatch()

  if (!isOpen) return null

  if (isOpen) {
    // Fetch all the records
  }

  return (
    <>
      <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden w-96 p-6">
          <div className="border-b-2 mb-4">
            <h1 className="text-2xl font-bold mb-2">Total Attendance</h1>
          </div>
          <div className="flex flex-col gap-4">{/* Add your content here */}</div>
          <div className="flex justify-end mt-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              this
            </button>
            <button
              className="ml-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              onClick={() => {
                setIsOpen(false)
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default TotalAttendanceModal
