import React, { forwardRef, useEffect } from 'react'
import Video from '../../components/candidate/video/Video'
import { useDispatch, useSelector } from 'react-redux'
import CandidateInfo from '../../components/candidate/candidateInfo/CandidateInfo'
import AttendanceInfo from '../../components/candidate/attendancdInfo/attendanceInfo'
import { showErrorToast, showSuccessToast } from '../../ui/Toasts'
import axios from 'axios'
import { setCandidateAttendanceStatus, setWebcamImage } from '../../redux/slices/candidateSlice'
import dataURLToBlob from '../../utility/dataUrlToBlob'
import { setTotalAttendance } from '../../redux/slices/totalAttendanceSlice'
import { setBatchAttendance } from '../../redux/slices/batchAttendanceSlice'

import NoImageAvailabePlaceholderImage from '../../assets/static-images/no-image-placeholder.svg.png'
import { setLabAttendance } from '../../redux/slices/labAttendanceSlice'

const CandidateAttendance = (props, inputRef) => {
  const candidateInfo = useSelector((state) => state.candidateInfo)
  const connectionData = useSelector((state) => state.connectionData)

  const dispatch = useDispatch()

  const handleMarkCandidateAttendance = async (e) => {
    e?.preventDefault?.()

    if (!candidateInfo.id || !candidateInfo.snapshotCaptured) {
      showErrorToast(`Please Capture a Photo.`)
      return
    }

    try {
      const url = `${connectionData.backendUrl}/api/attendence/v1/mark-present`

      const formData = new FormData()

      formData.set('id', candidateInfo.id)
      let candidatePhoto = dataURLToBlob(candidateInfo.capturedWebcamImagePath)
      let batch = candidateInfo.sl_batch_no
      formData.set('batch', batch)
      formData.set('student_photo', candidatePhoto)
      formData.set('labName', candidateInfo.lab_name)

      const { data: resData } = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Ensure the header is set correctly
        }
      })

      const { success, data, message, error } = resData

      if (success) {
        const { attendenceCount, batchCount, labCount } = data
        showSuccessToast(message || 'Attendance marked successfully')
        dispatch(
          setWebcamImage({
            snapshotCaptured: false,
            // capturedWebcamImagePath: '',
            justMarkedPresent: true
          })
        )
        dispatch(setTotalAttendance(attendenceCount?.[0]))
        dispatch(setBatchAttendance(batchCount?.[0]))
        dispatch(setLabAttendance(labCount?.[0]))
        dispatch(setCandidateAttendanceStatus(1))
        inputRef.current.focus()
      }
    } catch (err) {
      console.error(`Error while marking the attendance: ${err}`)
      console.showErrorToast(err?.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    console.log(candidateInfo)
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleMarkCandidateAttendance(e)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [candidateInfo.snapshotCaptured])

  function replaceColonsToUnderscore(item) {
    /**
     * eg. item = APMC ATPADI/users/APMC ATPADI_sign_600067_2025-02-17 21:58:31.jpeg
     * */
    if (!item) return false
    return item.split('/').pop().replaceAll(':', '_')
  }

  function getImage(img) {
    if (!img) return null
    return `${connectionData.backendUrl}/${candidateInfo.candidateImageRelativePath}/${replaceColonsToUnderscore(img)}`
  }

  return (
    <>
      {!candidateInfo.id ? (
        <>
          <h4 className="mt-16 text-center font-bold italic tracking-wide text-3xl">
            Please Enter Candidate Id to Search
          </h4>
        </>
      ) : (
        <>
          <div className="container mx-auto">
            {/* CANDIDATE INFO AND ATTENDANCE HOLDER */}
            <div className="mt-4 grid grid-cols-10 gap-4">
              {/* Left part is Candidate info */}
              <div className="col-span-6">
                <CandidateInfo />
              </div>

              {/* Right part is of Atttendance info */}
              <div className="col-span-4">
                <AttendanceInfo />
              </div>
            </div>

            {/* CANDIDATE PHOTO CAPTURE PART */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              {/* Left part for already uploaded candidate photos */}
              <div className="shadow-md rounded-[2rem] py-4  px-12">
                <div
                  id="already-uploaded-container"
                  className="photos-container rounded-[2rem] flex items-center justify-center gap-2"
                >
                  {/* <!--ALREADY UPLOADED IMAGE HERE --> */}
                  <div className="profile-holder w-[180px] aspect-[3/4]  overflow-hidden">
                    <img
                      id="student-image"
                      src={getImage(candidateInfo?.sl_image)}
                      onError={(e) => (e.target.src = NoImageAvailabePlaceholderImage)}
                      className="w-full h-full"
                    />
                  </div>
                  {/* <!-- ALREADY UPLOADED SIGN HERE --> */}
                  <div className="sign-holder w-[17rem] h-[6rem] border rounded-xl overflow-hidden">
                    <img
                      id="student-sign"
                      src={getImage(candidateInfo?.sl_sign)}
                      onError={(e) => {
                        e.target.src = NoImageAvailabePlaceholderImage
                      }}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Right part for photo capturing */}
              <div className="shadow-md rounded-[2rem] py-4 px-12">
                <div className="flex items-center justify-between">
                  <Video />
                </div>
              </div>
            </div>

            {/* Part for marking attendance or not */}

            {candidateInfo.sl_present_status != 1 && (
              <div className="status-buttons ">
                <div className="w-full flex justify-center gap-6 mt-6">
                  <button
                    type="button"
                    id="mark-present-btn"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleMarkCandidateAttendance}
                  >
                    Mark Present
                  </button>

                  <button
                    type="button"
                    id="reject-btn"
                    className="hidden items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    id="reset-page-btn"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reset Page
                  </button>
                </div>
              </div>
            )}

            {candidateInfo.sl_present_status == 1 && (
              <div className="status-buttons ">
                <div className="w-full flex justify-center gap-6 mt-6">
                  <div
                    className="inline-flex items-center animate-pulse px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleMarkCandidateAttendance}
                  >
                    This candidate already marked present
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default forwardRef(CandidateAttendance)
