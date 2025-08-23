import { forwardRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import UttirnaImageLogo from '../../assets/static-images/uttirna-logo-nobg.png'
import { showErrorToast, showSuccessToast, showWarningToast } from '../../ui/Toasts'

import { useDispatch, useSelector } from 'react-redux'
import { setBatchAttendance } from '../../redux/slices/batchAttendanceSlice'
import {
  resetCandidateInfo,
  setCandidateInfo,
  setWebcamImage
} from '../../redux/slices/candidateSlice'
import { setTotalAttendance } from '../../redux/slices/totalAttendanceSlice'

import axios from 'axios'
import { toggleSidebar } from '../../redux/slices/connectionDataSlice'
import { setLabAttendance } from '../../redux/slices/labAttendanceSlice'
import Sidebar from '../Sidebar'
import LabDropdown from './LabDropdown'
import { MESSAGE_TYPES } from '../../utility/constants'
import Modal from '../modals/BasicModal'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { IoSearchOutline } from 'react-icons/io5'
import { RiResetLeftLine } from 'react-icons/ri'

const Navbar = (props, inputRef) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const currentPath = location.pathname
  const connectionData = useSelector((state) => state.connectionData)
  const [batches, setBatches] = useState([])
  const [labs, setLabs] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  // SELECT BATCH AND LAB
  const [selectedBatch, setSelectedBatch] = useState([])
  const [selectedLabs, setSelectedLabs] = useState([])

  const [isSearchingCandiate, setIsSearchingCandidate] = useState(false)

  function handleSetSelectedLab(lab) {
    console.log('lab', lab)
    const isLabSelected = selectedLabs.some((_lab) => _lab.lab_no == lab.lab_no)
    setSelectedLabs((prev) =>
      isLabSelected ? prev.filter((_lab) => _lab.lab_no !== lab.lab_no) : [...prev, lab]
    )

    console.log(selectedLabs, '=selectedLabs')
  }

  useEffect(() => {
    const fetchCandidateAttendanceHomePageData = async () => {
      try {
        // Fetching the candidate data
        let url = `${connectionData.backendUrl}/api/attendence/v1/candidate-attendance-home-page-data`
        const { data: resData } = await axios.get(url)

        const { success, message, data } = resData

        if (success) {
          let { _batchList, _labList } = data
          setBatches(_batchList)
          setLabs(_labList)
        } else {
          showErrorToast(message || 'Something went wrong', 'Failed to home page data')
        }
      } catch (err) {
        console.log(err)
        showErrorToast('Failed to fetch the batches','Failed to home page data')
      }
    }

    fetchCandidateAttendanceHomePageData()
  }, [])

  // Fetches teh data from remote server
  const handleFetchCandidateData = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSearchingCandidate(true)
    try {
      if (!inputRef.current.value || isNaN(inputRef.current.value)) {
        showWarningToast('Please enter a valid candidate id', 'invalid-candidate-id')
        return
      }

      if (!selectedBatch) {
        showWarningToast('Please select a batch', 'invalid-batch')
        return
      }

      if (selectedLabs.length === 0) {
        showWarningToast('Please select atleast one lab', 'invalid-lab')
        return
      }

      // Fetching the candidate data
      let endpoint = `${connectionData.backendUrl}/api/attendence/v1/student-details`
      const { data: resData } = await axios.post(endpoint, {
        batch: selectedBatch,
        selectedLabs,
        id: inputRef.current.value,
        labName: ''
      })

      let { success, data, message, messageType = MESSAGE_TYPES.TOAST } = resData
      console.log(messageType, '==')
      console.log(message, '===message')

      if (success) {
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
      }

      switch (messageType) {
        case MESSAGE_TYPES.TOAST:
          showSuccessToast(message || 'Success')
          break
        case MESSAGE_TYPES.POPUP:
          setShowModal(true)
          setPopupMessage(message || 'Success')
          break
      }
    } catch (err) {
      const er = err?.response?.data
      showErrorToast(er?.message || 'Something went wrong', 'candidate-data-fetch-error')
    } finally {
      setIsSearchingCandidate(false)
    }
  }

  function handleResetSearch() {
    setSelectedBatch([])
    setSelectedLabs([])
    inputRef.current.value = ''
    dispatch(resetCandidateInfo())
  }

  return (
    <>
      <Sidebar />

      <Modal
        isOpen={showModal}
        setIsOpen={setShowModal}
        title="Alert"
        className=""
        onClose={() => {
          setShowModal(false)
          setPopupMessage('')
        }}
      >
        <span className="font-medium text-2xl">{popupMessage}</span>
      </Modal>

      <div className="bg-white sticky top-0 border-b border-gray-400">
        <div className=" mx-3 py-2">
          <div className="flex items-center justify-between font-semibold">
            <ul className="flex items-center gap-4 ">
              <li key="logo-image" onClick={() => dispatch(toggleSidebar(true))}>
                <img src={UttirnaImageLogo} alt="" className="w-10" />
              </li>

              {currentPath === '/candidate-attendance' && <p>Candidate Attendance</p>}
              {currentPath === '/staff-attendance' && <p>Staff Attendance</p>}
            </ul>
            {/* RIGHT */}
            {currentPath === '/candidate-attendance' && (
              <div>
                <div className="grid grid-cols-4 gap-4">
                  {/* Select batch options */}
                  <div>
                    <select
                      className="px-4 py-2 w-full h-full outline-none shadow-sm ring-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block text-md border border-gray-300 rounded-xl"
                      name="batch_id"
                      id="batch-id"
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      value={selectedBatch}
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

                  <LabDropdown
                    labs={labs}
                    handleSetSelectedLab={handleSetSelectedLab}
                    selectedLabs={selectedLabs}
                  />

                  <div className="input-holder w-full">
                    <input
                      ref={inputRef}
                      type="number"
                      name="search"
                      id="student-id"
                      placeholder="Search candidate..."
                      autoComplete="off"
                      className="p-2 w-full h-full outline-none shadow-sm ring-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block text-md border border-gray-300 rounded-xl"
                      // onChange={(e) => setCandidateId(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleFetchCandidateData(e)
                        }
                      }}
                    />
                  </div>
                  <div className="button-holder grid grid-cols-2 gap-4 w-full">
                    <button
                      type="button"
                      id="search-btn"
                      className={`relative ${isSearchingCandiate ? 'disabled:opacity-50' : ''} gap-2 overflow-hidden h-full w-[100%] justify-center inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      disabled={isSearchingCandiate}
                      onClick={handleFetchCandidateData}
                    >
                      <span
                        className={`flex gap-2 justify-center items-center transition-opacity duration-150 ${!isSearchingCandiate ? 'opacity-100' : 'opacity-0'}`}
                      >
                        <IoSearchOutline />
                        <span>Search</span>
                      </span>

                      <AiOutlineLoading3Quarters
                        className={`animate-spin absolute left-[40%] transition-opacity duration-150 ${isSearchingCandiate ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </button>
                    <button
                      type="button"
                      id="search-btn"
                      className={`relative gap-2 overflow-hidden h-full w-full justify-center inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                      onClick={() => {
                        handleResetSearch()
                      }}
                    >
                      <RiResetLeftLine />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default forwardRef(Navbar)
