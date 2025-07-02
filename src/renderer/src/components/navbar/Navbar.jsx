import { forwardRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import UttirnaImageLogo from '../../assets/static-images/uttirna-logo-nobg.png'
import { showErrorToast, showSuccessToast, showWarningToast } from '../../ui/Toasts'

import { useDispatch, useSelector } from 'react-redux'
import { setBatchAttendance } from '../../redux/slices/batchAttendanceSlice'
import { setCandidateInfo, setWebcamImage } from '../../redux/slices/candidateSlice'
import { setTotalAttendance } from '../../redux/slices/totalAttendanceSlice'

import axios from 'axios'
import { toggleSidebar } from '../../redux/slices/connectionDataSlice'
import { setLabAttendance } from '../../redux/slices/labAttendanceSlice'
import Sidebar from '../Sidebar'
import LabDropdown from './LabDropdown'
import { MESSAGE_TYPES } from '../../utility/constants'
import Modal from '../modals/BasicModal'

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

  function handleSetSelectedLab(lab) {
    const isLabSelected = selectedLabs.some((_lab) => _lab.lab_no == lab.lab_no)
    setSelectedLabs((prev) =>
      isLabSelected ? prev.filter((_lab) => _lab.lab_no !== lab.lab_no) : [...prev, lab]
    )
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
          showErrorToast(message || 'Something went wrong')
        }
      } catch (err) {
        console.log(err)
        showErrorToast('Failed to fetch the batches')
      }
    }

    fetchCandidateAttendanceHomePageData()
  }, [])

  // Fetches teh data from remote server
  const handleFetchCandidateData = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (!inputRef.current.value || isNaN(inputRef.current.value)) {
        showWarningToast('Please enter a valid candidate id')
        return
      }

      if (!selectedBatch) {
        showWarningToast('Please select a batch')
        return
      }

      if (selectedLabs.length === 0) {
        showWarningToast('Please select atleast one lab')
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
      showErrorToast(er?.message || 'Something went wrong')
    }
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
        <div className="container mx-auto px-4 py-2">
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
                      className="px-4 py-2 outline-none shadow-sm ring-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block text-md border border-gray-300 rounded-xl"
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

                  <div className="input-holder">
                    <input
                      ref={inputRef}
                      type="number"
                      name="search"
                      id="student-id"
                      placeholder="Search candidate..."
                      autoComplete="off"
                      className="p-2 outline-none shadow-sm ring-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-48  text-md border border-gray-300 rounded-xl"
                      // onChange={(e) => setCandidateId(e.target.value)}
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
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default forwardRef(Navbar)
