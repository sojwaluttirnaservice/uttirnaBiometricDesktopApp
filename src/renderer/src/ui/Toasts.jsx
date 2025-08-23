import React from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const SuccessToast = ({ message }) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Message */}
      <p className="text-sm font-medium text-gray-800 capitalize">{message}</p>
    </div>
  )
}

// Function to trigger the toast
export const showSuccessToast = (message, source = 'default') => {
  toast.success(<SuccessToast message={message} />, {
    toastId: `toast_${source}`,
    position: 'bottom-center',
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light'
    // icon: false
  })
}

export const WarningToast = ({ message }) => {
  return (
    <div className="flex items-center space-x-3">
      <p className="text-sm font-medium text-gray-800 capitalize">{message}</p>
    </div>
  )
}

export const showWarningToast = (message, source = 'default') => {
  toast.warn(<WarningToast message={message} />, {
    toastId: `toast_${source}`,
    position: 'bottom-center',
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light'
  })
}

export const ErrorToast = ({ message }) => {
  return (
    <div className="flex items-center space-x-3">
      <p className="text-sm font-medium text-gray-800 capitalize">{message}</p>
    </div>
  )
}

export const showErrorToast = (message, source = 'default') => {
  toast.error(<ErrorToast message={message} />, {
    toastId: `toast_${source}`,
    position: 'bottom-center',
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light'
  })
}
