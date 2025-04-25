import { forwardRef, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import UttirnaImageLogo from '../../assets/static-images/uttirna-logo-nobg.png'
import { showErrorToast, showSuccessToast, showWarningToast } from '../../ui/Toasts'

import { useDispatch, useSelector } from 'react-redux'
import { setBatchAttendance } from '../../redux/slices/batchAttendanceSlice'
import { setCandidateInfo, setWebcamImage } from '../../redux/slices/candidateSlice'
import { setTotalAttendance } from '../../redux/slices/totalAttendanceSlice'

import DangerModal from '../modals/confirmationModals/DangerModal'

import axios from 'axios'
import { toggleSidebar } from '../../redux/slices/connectionDataSlice'
import { setLabAttendance } from '../../redux/slices/labAttendanceSlice'
import Sidebar from '../Sidebar'

const Navbar = (props, inputRef) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const currentPath = location.pathname
  console.log({ location })
  const connectionData = useSelector((state) => state.connectionData)
  const [batches, setBatches] = useState([])

  // STORE SELECTED CANDIDATE ID
  const [candidateId, setCandidateId] = useState('')

  // SELECT BATCH AND LAB
  const [batch, setBatch] = useState('')
  const [lab, setLab] = useState('')

  // WHEN THE COMPONENT RELOADED, GET THE BATCH AND LAB FROM LOCAL STORAGE
  useEffect(() => {
    const storedBatch = localStorage.getItem('batch')
    if (storedBatch) {
      setBatch(storedBatch)
    }

    const storedLab = localStorage.getItem('lab')
    if (storedLab) {
      setLab(storedLab)
    }

    // Remove the batch and lab from local storage when the component unmounts
    return () => {
      localStorage.removeItem('batch')
      localStorage.removeItem('lab')
      setCandidateId(null)
    }
  }, [])

  // Handles the change in the selected batch

  useEffect(() => {
    // fetcht the batches corresponding the lab
    const handleFetchBatches = async () => {
      try {
        // Fetching the candidate data
        let url = `${connectionData.backendUrl}/api/attendence/v1/batch-list`
        const { data: resData } = await axios.get(url)

        const { success, message, data } = resData

        if (success) {
          let { _batchList } = data
          setBatches(_batchList)
        } else {
          showErrorToast(message || 'Something went wrong')
        }
      } catch (err) {
        console.log(err)
        showErrorToast('Failed to fetch the batches')
      }
    }

    const handleBatchChange = () => {
      if (lab == '') setBatch('')
      localStorage.setItem('batch', batch)
      handleFetchBatches()
    }
    handleBatchChange()
  }, [])

  // Fetches teh data from remote server
  const handleFetchCandidateData = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (!candidateId || isNaN(candidateId)) {
        showWarningToast('Please enter a valid candidate id')
        return
      }

      if (!batch) {
        showWarningToast('Please select a batch')
        return
      }
      // Fetching the candidate data
      let endpoint = `${connectionData.backendUrl}/api/attendence/v1/student-details`
      const { data: resData } = await axios.post(endpoint, {
        batch,
        id: candidateId,
        labName: lab
      })

      let { success, data, message } = resData
      console.log(data, '==data==')

      if (success) {
        showSuccessToast('Candidate data fetched.')
        const {
          student,
          studentAttendenceCount,
          batchAttendanceCount,
          labAttendanceCount,
          already_present
        } = data

        dispatch(setCandidateInfo(student))
        dispatch(setTotalAttendance(studentAttendenceCount?.[0]))
        dispatch(setBatchAttendance(batchAttendanceCount?.[0]))
        dispatch(setLabAttendance(labAttendanceCount?.[0]))
        dispatch(
          setWebcamImage({
            snapshotCaptured: false,
            capturedWebcamImagePath: '',
            justMarkedPresent: false
          })
        )
        return
      }

      if (!success) {
        showWarningToast(message || 'Failed to fetch data')
      }
    } catch (err) {
      console.error(`Error while fetching the candidate details: ${err}`)
      showErrorToast(err?.message || 'Something went wrong')
    }
  }

  return (
    <>
      <Sidebar />

      <div className="bg-white sticky top-0 border-b border-gray-400">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between font-semibold">
            {/* LEFT */}
            <ul className="flex items-center gap-4 ">
              <li key="logo-image" onClick={() => dispatch(toggleSidebar(true))}>
                <img src={UttirnaImageLogo} alt="" className="w-10" />
              </li>

              {currentPath === '/candidate-attendance' && <p>Candidate Attendance</p>}
              {currentPath === '/staff-attendance' && <p>Staff Attendance</p>}
            </ul>
            {/* MIDDLE */}
            {currentPath === '/candidate-attendance' && (
              <div>
                <div className="flex items-center gap-4">
                  {/* Select batch options */}
                  <div>
                    <select
                      className="px-4 py-2 outline-none shadow-sm ring-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block text-md border border-gray-300 rounded-xl"
                      name="batch_id"
                      id="batch-id"
                      onChange={(e) => setBatch(e.target.value)}
                      value={batch}
                    >
                      <option
                        value=""
                        className="text-center py-2 font-semibold bg-transparent hover:bg-purple-100 hover:text-black focus:bg-purple-500 focus:text-white"
                      >
                        --Select Batch--
                      </option>
                      {batches.map((singleBatch) => {
                        return (
                          <option
                            key={singleBatch.sl_batch_no}
                            value={singleBatch.sl_batch_no}
                            className="text-center py-2 font-semibold bg-transparent hover:bg-purple-100 hover:text-black focus:bg-purple-500 focus:text-white"
                          >
                            Batch - {singleBatch.sl_batch_no}
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <div className="input-holder">
                      <input
                        ref={inputRef}
                        type="number"
                        name="search"
                        id="student-id"
                        placeholder="Search candidate..."
                        autoComplete="off"
                        className="p-2 outline-none shadow-sm ring-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-48  text-md border border-gray-300 rounded-xl"
                        value={candidateId}
                        onChange={(e) => setCandidateId(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleFetchCandidateData(e)
                          }
                        }}
                      />
                    </div>
                    <div className="button-holder">
                      <button
                        type="button"
                        id="search-btn"
                        className="relative overflow-hidden inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleFetchCandidateData}
                      >
                        <span>Search</span>
                        <div id="btn-loader-container">
                          <div className="btn-loader-inside">
                            <div id="btn-loader"></div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* RIGHT */}
            <div>Connected To: {connectionData.backendUrl}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default forwardRef(Navbar)
