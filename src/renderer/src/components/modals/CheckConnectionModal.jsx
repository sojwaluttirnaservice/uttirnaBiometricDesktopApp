import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { showSuccessToast, showWarningToast } from '../../ui/Toasts'
import { useDispatch, useSelector } from 'react-redux'
import { setConnectionData } from '../../redux/slices/connectionDataSlice'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod/v4'
import { formatZodErrors } from '../../utility/help'
import InputError from '../../ui/InputError'
import { ROLES } from '../../utility/constants'

const initialErrorObject = {
  protocol: '',
  ipAddress: '',
  port: '',
  role: '',
  username: '',
  password: ''
}

const CheckConnectionModal = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const LoginValidationSchema = z.object({
    protocol: z.string({ required_error: 'Protocol must be a string' }),
    ipAddress: z.string({ required_error: 'Invalid IP address' }),
    port: z
      .number({ required_error: 'Port is required' })
      .min(1, { message: 'Port must be a positive number' }),
    role: z.enum([ROLES.BIOMETRIC_CANDIDATE_ATTENDANCE, ROLES.BIOMETRIC_STAFF_ATTENDANCE], {
      errorMap: () => ({ message: 'Invalid role selected' })
    }),
    username: z
      .string({ required_error: 'Username is required' })
      .min(1, { message: 'Username must be at least 1 characters' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, { message: 'Password must be at least 1 characters' })
  })

  const initialBackendConnectionData = {
    protocol: 'http',
    ipAddress: 'localhost',
    port: 3050,
    role: ROLES.BIOMETRIC_CANDIDATE_ATTENDANCE,
    username: '',
    password: ''
  }

  const [backendConnectionData, setBackendConnectionData] = useState(initialBackendConnectionData)
  const [isConnecting, setIsConnecting] = useState(false)
  const [errors, setErrors] = useState(initialErrorObject)
  const [cancelTokenSource, setCancelTokenSource] = useState(null) // Store the cancel token source

  useEffect(() => {
    let backendConnectionDataFromLocalStorage = localStorage.getItem('backendConnectionData')
    if (backendConnectionDataFromLocalStorage) {
      try {
        setBackendConnectionData(JSON.parse(backendConnectionDataFromLocalStorage))
      } catch (error) {
        console.error('Error parsing backend connection data:', error)
        setBackendConnectionData(initialBackendConnectionData)
      }
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type } = e.target

    setBackendConnectionData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const validateLoginForm = () => {
    console.log(backendConnectionData, '==backendConnectionData')
    const isValid = LoginValidationSchema.safeParse(backendConnectionData)

    if (isValid?.success) {
      setErrors(initialErrorObject)
      return true
    }

    const errors = formatZodErrors(isValid.error.format())
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return false
    }
    return true
  }

  const handleCheckConnection = async (e) => {
    e.preventDefault()
    if (!validateLoginForm()) {
      return
    }
    setIsConnecting(true)
    try {
      if (cancelTokenSource) {
        cancelTokenSource.cancel('New request made previous is cancled')
      }

      // Create a new cancel token each time a new request is made
      const source = axios.CancelToken.source()
      setCancelTokenSource(source) // Set the cancel token source to state

      const constructedBackendUrl = constructBackendUrl(backendConnectionData)
      const endpoint = '/api/auth/v1/login'

      // Making the API request with the cancel token
      const { data: resData } = await axios.post(
        `${constructedBackendUrl}${endpoint}`,
        { ...backendConnectionData },
        {
          cancelToken: source.token
        }
      )

      console.log({ resData })

      const { success, message, data } = resData
      console.log(data, '=data=check data')

      if (success) {
        showSuccessToast(message || 'Successfully Connected')
        dispatch(
          setConnectionData({
            ...backendConnectionData,
            status: 'Connected',
            backendUrl: constructedBackendUrl,
            projectConfig: data
          })
        )

        localStorage.setItem('backendConnectionData', JSON.stringify(backendConnectionData))

        if (backendConnectionData.role === ROLES.BIOMETRIC_CANDIDATE_ATTENDANCE) {
          navigate('/candidate-attendance')
        }

        if (backendConnectionData.role === ROLES.BIOMETRIC_STAFF_ATTENDANCE) {
          navigate('/staff-attendance')
        }
      } else {
        showWarningToast('Connection failed')
      }
    } catch (err) {
      // Handle request cancellation or errors
      if (axios.isCancel(err)) {
        console.log('Request canceled')
      } else {
        if (err.response) {
          // The server responded with a status code outside the 2xx range
          console.error('Error response:', err.response)
          // You can show a user-friendly message here
          showWarningToast('There was a problem with the server. Please try again later.')
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response:', err.request)
          // You can show a user-friendly message here
          showWarningToast('Could not connect to the server. Please check your network connection.')
        } else {
          // Something else happened in setting up the request
          // console.error('Error setting up request:', err.message)
          // showWarningToast('An error occurred. Please try again.')
          console.error('Connection failed:', err)
          showWarningToast('Connection failed. Please try again later.')
        }
      }
    } finally {
      // End the loading state
      setIsConnecting(false)
    }
  }

  const constructBackendUrl = (backendConnectionData) => {
    return `${backendConnectionData.protocol}://${backendConnectionData.ipAddress}:${backendConnectionData.port}`
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
            <h1 className="text-2xl font-bold mb-2">Login</h1>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="protocol" className="block text-sm font-medium text-gray-700">
                Protocol
              </label>
              <select
                id="protocol"
                name="protocol"
                className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={backendConnectionData.protocol}
                onChange={handleInputChange}
              >
                <option value="http">http</option>
                <option value="https">https</option>
              </select>
              {errors?.protocol && <InputError>{errors.protocol}</InputError>}
            </div>
            <div>
              <label
                htmlFor="server-ip-address-name"
                className="block text-sm font-medium text-gray-700"
              >
                Server IP Address
              </label>
              <input
                type="text"
                id="server-ip-address-name"
                name="ipAddress"
                className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter exam server Id"
                value={backendConnectionData.ipAddress}
                onChange={handleInputChange}
              />

              {errors?.ipAddress && <InputError>{errors.ipAddress}</InputError>}
            </div>

            <div>
              <label htmlFor="port" className="block text-sm font-medium text-gray-700">
                Port
              </label>
              <input
                type="text"
                id="port"
                name="port"
                className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter exam server Id"
                value={backendConnectionData.port}
                onChange={handleInputChange}
              />
              {errors?.port && <InputError>{errors.port}</InputError>}
            </div>

            <div className="grid grid-cols-3 items-center">
              <label htmlFor="" className="block text-sm font-medium text-gray-700 ">
                User Type
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="role"
                  id="candidate-attendance"
                  value={ROLES.BIOMETRIC_CANDIDATE_ATTENDANCE}
                  onChange={handleInputChange}
                  checked={backendConnectionData.role == ROLES.BIOMETRIC_CANDIDATE_ATTENDANCE}
                />
                <label htmlFor="candidate-attendance">User</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="role"
                  id="staff-attendance"
                  value={ROLES.BIOMETRIC_STAFF_ATTENDANCE}
                  onChange={handleInputChange}
                  checked={backendConnectionData.role == ROLES.BIOMETRIC_STAFF_ATTENDANCE}
                />
                <label htmlFor="staff-attendance">Admin</label>
              </div>
              {errors?.role && <InputError>{errors.role}</InputError>}

              {/* <input
                type="text"
                id="port"
                name="port"
                className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter exam server Id"
                value={backendConnectionData.role}
                onChange={handleInputChange}
              /> */}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter Username"
                value={backendConnectionData?.username}
                onChange={handleInputChange}
              />
              {errors?.username && <InputError>{errors.username}</InputError>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="text"
                id="password"
                name="password"
                className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter Password"
                value={backendConnectionData?.password}
                onChange={handleInputChange}
              />
              {errors?.password && <InputError>{errors.password}</InputError>}
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={handleCheckConnection}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting' : 'Connect'}
            </button>

            <button
              className="hidden ml-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              onClick={() => {
                /* Close modal logic here */
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

export default CheckConnectionModal
