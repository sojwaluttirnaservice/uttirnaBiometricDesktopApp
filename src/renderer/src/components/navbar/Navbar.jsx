import { forwardRef, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import UttirnaImageLogo from '../../assets/static-images/uttirna-logo-nobg.png'
import { showErrorToast, showSuccessToast, showWarningToast } from '../../ui/Toasts'

import { useDispatch, useSelector } from 'react-redux'
import { setCandidateInfo, setWebcamImage } from '../../redux/slices/candidateSlice'
import { setTotalAttendance } from '../../redux/slices/totalAttendanceSlice'
import { setBatchAttendance } from '../../redux/slices/batchAttendanceSlice'

import DeleteConfirmationModal from '../modals/confirmationModals/DeleteConfirmationModal'

import axios from 'axios'
import { resetConnectionData } from '../../redux/slices/connectionDataSlice'

const Navbar = (props, inputRef) => {
  const connectionData = useSelector((state) => state.connectionData)

  const dispatch = useDispatch()

  //  STORE AN ARRAY OF BATCHES AND LABS RESEPECTIVELY
  const [batches, setBatches] = useState([])
  const [labs, setLabs] = useState([])

  // STORE SELECTED CANDIDATE ID
  const [candidateId, setCandidateId] = useState('')

  // SELECT BATCH AND LAB
  const [batch, setBatch] = useState('')
  const [lab, setLab] = useState('')

  const [isSelectLabDisabled, setIsSelectLabDisabled] = useState(false)

  // Modal state for DeleteConfirmationModal
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConfirmReset = () => {
    setLab('')
    setIsSelectLabDisabled(false)
    setIsModalOpen(false)
  }

  // Get the batch from local storage and set the value for select tag

  //TODO: USE EFFECT FETCHES THE LABS AND BATCHES
  useEffect(() => {
    // Fetch differenct batches and labs from the database

    const handleFetchBatches = async () => {
      try {
        // TODO: Fetch batches and set them into below variable

        const dummyBatches = [1, 2, 3, 4, 5]
        setBatches(dummyBatches)
      } catch (err) {
        console.error(err)
        showErrorToast(err.message || 'Failed to fetch batches')
      }
    }

    handleFetchBatches()

    const handleFetchLabs = async () => {
      try {
        // TODO: Fetch batches and set them into below variable

        const dummyLabs = [1, 2, 3, 4, 5]
        setLabs(dummyLabs)
      } catch (err) {
        console.error(err)
        showErrorToast(err.message || 'Failed to fetch labs')
      }
    }

    handleFetchLabs()
  }, [])

  useEffect(() => {
    const storedBatch = localStorage.getItem('batch')
    if (storedBatch) {
      setBatch(storedBatch)
    }

    const storedLab = localStorage.getItem('lab')
    if (storedLab) {
      setLab(storedLab)
    }
  }, [])

  // Handles the change in the selected batch

  useEffect(() => {
    const handleBatchChange = () => {
      if (lab == '') setBatch('')
      localStorage.setItem('batch', batch)
    }
    handleBatchChange()
  }, [batch, lab])

  const handleLabChange = (e) => {
    let selectedLab = e.target.value
    setLab(selectedLab)
    // also reset the batch too
    setBatch('')

    if (selectedLab) setIsSelectLabDisabled(true)
    localStorage.setItem('lab', selectedLab)
  }

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
      // Fetching the studen data
      let endpoint = `${connectionData.backendUrl}/api/attendence/v1/student-details`
      const { data: resData } = await axios.post(endpoint, {
        batch,
        id: candidateId
      })

      let { success, data, message } = resData

      if (success) {
        showSuccessToast('Candidate data fetched.')
        const { student, studentAttendenceCount, batchAttendanceCount, already_present } = data

        dispatch(setCandidateInfo(student))
        dispatch(setTotalAttendance(studentAttendenceCount?.[0]))
        dispatch(setBatchAttendance(batchAttendanceCount?.[0]))
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

  const navLinks = [
    { path: '/', label: 'Candidate' }
    // { path: '/staff', label: 'Staff' }
  ]

  return (
    <>
      {/* DeleteConfirmationModal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleConfirmReset}
        title="Are you sure you want to reset the lab?"
        message="This action will clear the selected lab and batch."
      />
      <div className="bg-white sticky top-0 border-b border-gray-400">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between font-semibold">
            {/* LEFT */}
            <ul className="flex items-center gap-4 ">
              <li key="logo-image">
                <img src={UttirnaImageLogo} alt="" className="w-10" />
              </li>
              {navLinks.map((linkItem, index) => {
                return (
                  <li key={linkItem.label}>
                    <NavLink to={linkItem.path} className="text-black-600 hover:text-gray-">
                      {linkItem.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
            {/* MIDDLE */}
            <div>
              <div className="flex items-center gap-4">
                {/* Select lab option */}
                <div>
                  <select
                    className="px-4 py-2 outline-none shadow-sm ring-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block text-md border border-gray-300 rounded-xl"
                    name="lab_no"
                    id="lab-no"
                    onChange={handleLabChange}
                    value={lab}
                    disabled={isSelectLabDisabled}
                  >
                    <option
                      value=""
                      className="text-center py-2 font-semibold bg-transparent hover:bg-purple-100 hover:text-black focus:bg-purple-500 focus:text-white"
                    >
                      --Select Lab--
                    </option>
                    f
                    {labs.map((labNumber) => {
                      return (
                        <option
                          key={labNumber}
                          value={labNumber}
                          className="text-center py-2 font-semibold bg-transparent hover:bg-purple-100 hover:text-black focus:bg-purple-500 focus:text-white"
                        >
                          LAB - {labNumber}
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* Select batch options */}
                <div>
                  <select
                    className="px-4 py-2 outline-none shadow-sm ring-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block text-md border border-gray-300 rounded-xl"
                    name="batch_id"
                    id="batch-id"
                    onChange={(e) => setBatch(e.target.value)}
                    value={batch}
                    // Select atlease one lab for enalbling this
                    disabled={!lab ? true : false}
                  >
                    <option
                      value=""
                      className="text-center py-2 font-semibold bg-transparent hover:bg-purple-100 hover:text-black focus:bg-purple-500 focus:text-white"
                    >
                      --Select Batch--
                    </option>
                    {batches.map((batchNumber) => {
                      return (
                        <option
                          key={batchNumber}
                          value={batchNumber}
                          className="text-center py-2 font-semibold bg-transparent hover:bg-purple-100 hover:text-black focus:bg-purple-500 focus:text-white"
                        >
                          Batch - {batchNumber}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="input-holder">
                    <input
                      ref={inputRef}
                      type="text"
                      name="search"
                      id="student-id"
                      placeholder="Search candidate..."
                      autoComplete="off"
                      className="p-2 outline-none shadow-sm ring-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 text-md border border-gray-300 rounded-xl"
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

                  <div className="reset-lab-holder">
                    <button
                      type="button"
                      id="reset-lab-btn"
                      className="relative overflow-hidden inline-flex items-center px-4 py-2 border  text-sm font-medium rounded-xl shadow-sm border-rose-700 text-rose-600 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                      // onClick={() => setLab('')}
                      onClick={() => setIsModalOpen(true)}
                    >
                      <span>Reset Lab</span>
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
            {/* RIGHT */}
            <div>Connected To: {connectionData.backendUrl}</div>{' '}
            <button
              className="w-6 h-6 ml-1 bg-rose-500 p-1 rounded-full"
              type="button"
              onClick={(e) => {
                e.preventDefault()
                dispatch(resetConnectionData())
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  // fill="#dc2626"
                  fill="#fff"
                  d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 320 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-210.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128zM352 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96L512 128c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>{' '}
    </>
  )
}

export default forwardRef(Navbar)
