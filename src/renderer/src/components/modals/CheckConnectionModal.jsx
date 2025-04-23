import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { showSuccessToast, showWarningToast } from '../../ui/Toasts'
import { useDispatch } from 'react-redux'
import { setConnectionData } from '../../redux/slices/connectionDataSlice'

const CheckConnectionModal = () => {
  const dispatch = useDispatch()

  const initialBackendConnectionData = {
    protocol: 'http',
    ipAddress: '192.168.1.11',
    port: 3050
  }

  const [backendConnectionData, setBackendConnectionData] = useState(initialBackendConnectionData)
  const [isConnecting, setIsConnecting] = useState(false)
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
    const { name, value } = e.target
    setBackendConnectionData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleCheckConnection = async (e) => {
    e.preventDefault()

    // Create a new cancel token each time a new request is made
    const source = axios.CancelToken.source()
    setCancelTokenSource(source) // Set the cancel token source to state

    setIsConnecting(true) // Show the loading state (disable the button)
    try {
      let constructedBackendUrl = `${backendConnectionData.protocol}://${backendConnectionData.ipAddress}:${backendConnectionData.port}`
      let endpoint = '/api/v1/check-status'

      // Making the API request with the cancel token
      const { data: resData } = await axios.get(`${constructedBackendUrl}${endpoint}`, {
        cancelToken: source.token
      })

      const { success, call, message } = resData

      if (success || call) {
        showSuccessToast(message || 'Successfully Connected')
        dispatch(
          setConnectionData({
            ...backendConnectionData,
            status: 'Connected',
            backendUrl: constructedBackendUrl
          })
        )

        setIsConnecting(false)

        localStorage.setItem('backendConnectionData', JSON.stringify(backendConnectionData))
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

  return (
    <>
      <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden w-96 p-6">
          <div className="border-b-2 mb-4">
            <h1 className="text-2xl font-bold mb-2">Check Server Connection</h1>
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
              className="hidden px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              onClick={handleCheckConnection}
              disabled={isConnecting}
            >
              Cancel
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
