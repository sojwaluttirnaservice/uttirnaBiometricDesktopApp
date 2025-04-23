import React, { useState } from 'react'
import { showErrorToast } from '../../../ui/Toasts'

const ErrorModal = ({
  isOpen,
  setIsOpen,
  onRetry,
  hideClose = false,
  errorMessage = 'An unexpected error occurred.',
  isRetrying
}) => {
  const handleRetry = async () => {
    try {
      await onRetry()
    //   setIsOpen(false) // Close modal on successful retry
    } catch (error) {
      console.error('Retry failed', error)
      showErrorToast(error)
    }
  }

  if (!isOpen) return null // Don't render modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="#dc2626"
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl text-center font-semibold text-gray-900 mb-2">Error</h3>
        <p className="text-xl text-center text-gray-500 mb-4">{errorMessage}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleRetry}
            disabled={isRetrying} // Disable button while retrying
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none disabled:opacity-50"
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>

          {!hideClose && (
            <button
              onClick={onClose} // Close modal when clicking Cancel
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorModal
