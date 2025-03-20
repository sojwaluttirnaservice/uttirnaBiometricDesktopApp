import React from 'react'
import Modal, { BasicModal, ModalBody, ModalDialog, ModalFooter, ModalHeader } from '../BasicModal'

const ActionConfirmationModal = ({
  isOpen,
  setIsOpen,
  onClose = () => setIsOpen(false), // Default onClose to setIsOpen(false)
  onConfirm,
  title = 'Action Successful!',
  message = 'Your action has been completed successfully.',
  confirmButtonText = 'Great, Thank You!'
}) => {
  if (!isOpen) return null // Don't render modal if it's not open

  return (
    <>
      <BasicModal>
        <ModalDialog>
          <ModalHeader title={title} onClose={onClose} />
          <ModalBody isScrollable={false}>
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#10b981"
                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg text-center font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{message}</p>
          </ModalBody>
          <ModalFooter onConfirm={onConfirm} onClose={onClose}>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
            >
              {confirmButtonText}
            </button>
          </ModalFooter>
        </ModalDialog>
      </BasicModal>
    </>
  )
}

export default ActionConfirmationModal
