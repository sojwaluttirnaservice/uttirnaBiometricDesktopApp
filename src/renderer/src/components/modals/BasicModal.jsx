import React from 'react'

// ModalDialog - The container for the modal content
const ModalDialog = ({ children }) => {
  return <div className="relative bg-white rounded-lg shadow-lg w-96 p-6">{children}</div>
}

// ModalHeader - The header section with a close button
const ModalHeader = ({ title, onClose }) => {
  return (
    <div className="flex justify-between items-center border-b pb-4">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6">
          <path
            fill="currentColor"
            d="M328.1 184.1L327.3 183.3 183.3 327.3 184.1 328.1l144-144 144 144 0.8-0.8-0.8-0.8zM0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0z"
          />
        </svg>
      </button>
    </div>
  )
}

// ModalBody - The body section with scrollable content
const ModalBody = ({ children, isScrollable }) => {
  return <div className={`mt-4 ${isScrollable ? 'overflow-y-auto max-h-60' : ''}`}>{children}</div>
}

// ModalFooter - The footer with action buttons
const ModalFooter = ({ onConfirm, onClose }) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={onConfirm}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
      >
        Confirm
      </button>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
      >
        Cancel
      </button>
    </div>
  )
}

// Main Modal Component that combines everything
const Modal = ({
  children,
  isOpen,
  setIsOpen,
  title = 'Modal Title',
  onConfirm = () => {},
  onClose = () => setIsOpen(false),
  isScrollable = false
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <ModalDialog>
        <ModalHeader title={title} onClose={onClose} />
        <ModalBody isScrollable={isScrollable}>
          <p className="text-sm text-gray-500">{children}</p>
        </ModalBody>
        <ModalFooter onConfirm={onConfirm} onClose={onClose} />
      </ModalDialog>
    </div>
  )
}

export default Modal
