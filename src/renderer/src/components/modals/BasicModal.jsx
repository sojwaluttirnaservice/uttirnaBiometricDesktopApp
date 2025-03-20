import React from 'react'

// ModalDialog - The container for the modal content

export const BasicModal = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      {children}
    </div>
  )
}

export const ModalDialog = ({ children, width = 'w-50', height = 'min-vh-100' }) => {
  return (
    <div
      className={`modal-dialog ${width ?? 'w-96'} ${height} relative bg-white rounded-lg shadow-lg p-6`}
      style={{ overflowY: 'auto' }}
    >
      <div className="modal-content relative h-full flex flex-col">{children}</div>
    </div>
  )
}

// ModalHeader - The header section with a close button
export const ModalHeader = ({ title, onClose }) => {
  return (
    <div className="flex justify-between items-center border-b pb-4">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      {/* <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6">
          <path
            fill="currentColor"
            d="M328.1 184.1L327.3 183.3 183.3 327.3 184.1 328.1l144-144 144 144 0.8-0.8-0.8-0.8zM0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0z"
          />
        </svg>
      </button> */}
    </div>
  )
}

// ModalBody - The body section with scrollable content
export const ModalBody = ({ children, isScrollable }) => {
  return <div className={`mt-4 grow ${isScrollable ? 'overflow-y-auto' : ''}`}>{children}</div>
}

// ModalFooter - The footer with action buttons
export const ModalFooter = ({ children, onClose, setIsOpen, hideCloseButton }) => {
  const handleClose = (e) => {
    e.preventDefault()
    if (onClose) {
      onClose() // If onClose is provided, call it
    } else {
      setIsOpen(false) // If onClose is not provided, close modal via setIsOpen
    }
  }
  return (
    <div className="mt-auto">
      <div className="border-t pt-2 flex justify-end gap-2 mt-4">
        {children}

        {!hideCloseButton && (
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
        )}
      </div>
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
  onClose,
  hideCloseButton = false,
  isScrollable = false
}) => {
  if (!isOpen) return null

  return (
    <BasicModal>
      <ModalDialog>
        <ModalHeader title={title} onClose={onClose} />
        <ModalBody isScrollable={isScrollable}>
          <p className="text-sm text-gray-500">{children}</p>
        </ModalBody>
        <ModalFooter
          setIsOpen={setIsOpen}
          onConfirm={onConfirm}
          hideCloseButton={hideCloseButton}
          onClose={onClose}
        />
      </ModalDialog>
    </BasicModal>
  )
}

export default Modal
