import React, { useState } from 'react'
import Modal, { BasicModal, ModalBody, ModalDialog, ModalFooter, ModalHeader } from '../BasicModal'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorToast, showSuccessToast } from '../../../ui/Toasts'
import axios from 'axios'
import { loginUser } from '../../../redux/slices/userSlice'
import { resetConnectionData } from '../../../redux/slices/connectionDataSlice'

const LoginModal = ({
  isOpen,
  setIsOpen,
  width,
  height,
  onClose, // Default onClose to setIsOpen(false)
  onConfirm,
  hideCloseButton = false,
  title = 'Action Successful!',
  message = 'Your action has been completed successfully.',
  confirmButtonText = 'Great, Thank You!'
}) => {
  if (!isOpen) return null // Don't render modal if it's not open

  const connectionData = useSelector((state) => state.connectionData)
  const userSlice = useSelector((state) => state.userSlice)

  const [tryingLogin, setTryingLogin] = useState(false)

  const dispatch = useDispatch()

  const [user, setUser] = useState({
    username: 'utr',
    password: 'utr',
    isLoggedIn: false,
    userRole: 'BIOMETRIC'
  })

  const handleUserChange = (e) => {
    e.preventDefault()
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setTryingLogin(true)
      const url = `${connectionData.backendUrl}/api/auth/v1/login`

      const { data: resData } = await axios.post(url, user)

      const { success, message, data } = resData
      if (success) {
      
          dispatch(loginUser({ ...user, isLoggedIn: true }))
          showSuccessToast(message)
          setTryingLogin(false)
       
      } else {
        showErrorToast(message)
        setTryingLogin(false)
      }
    } catch (err) {
      setTryingLogin(false)
      if (err.response) {
        console.log(err.response)
        const { success, message } = err.response.data
        showErrorToast(message)
      } else {
        console.error(`Error while trying to login: ${err}`)
        showErrorToast(err)
      }
    }
  }

  return (
    <>
      <BasicModal>
        <ModalDialog width={width} height={height}>
          <ModalHeader title={title} onClose={onClose} />
          <ModalBody isScrollable={false}>
            <div className="flex items-center justify-center mb-4">
              {/* <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#10b981"
                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                  />
                </svg>
              </div> */}
            </div>
            <h3 className="text-lg text-center font-semibold text-gray-900 mb-2">{title}</h3>

            <div className="flex flex-col gap-2 items-center  justify-between">
              <div className="w-[80%]">
                <label htmlFor="port" className="block text-sm font-bold text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter username here"
                  onChange={handleUserChange}
                  value={user.username}
                />
              </div>

              <div className="w-[80%]">
                <label htmlFor="port" className="block text-sm font-bold text-gray-700">
                  Password
                </label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                  onChange={handleUserChange}
                  value={user.password}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter onClose={onClose} hideCloseButton={hideCloseButton}>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              {tryingLogin ? 'Loggin in' : 'Login'}
            </button>

            <button
              onClick={() => {
                dispatch(resetConnectionData())
                showSuccessToast('Connection reset successful')
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
            >
              Reset Connection
            </button>
          </ModalFooter>
        </ModalDialog>
      </BasicModal>
    </>
  )
}

export default LoginModal
