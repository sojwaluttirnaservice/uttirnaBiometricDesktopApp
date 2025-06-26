import axios from 'axios'
import { forwardRef, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AttendanceInfo from '../../components/candidate/attendancdInfo/attendanceInfo'
import CandidateInfo from '../../components/candidate/candidateInfo/CandidateInfo'
import { setBatchAttendance } from '../../redux/slices/batchAttendanceSlice'
import { setCandidateAttendanceStatus, setWebcamImage } from '../../redux/slices/candidateSlice'
import { setTotalAttendance } from '../../redux/slices/totalAttendanceSlice'
import { showErrorToast, showSuccessToast } from '../../ui/Toasts'
import dataURLToBlob from '../../utility/dataUrlToBlob'

import NoImageAvailabePlaceholderImage from '../../assets/static-images/no-image-placeholder.svg.png'
import WebCamera from '../../components/candidate/video/WebCamera'
import { setLabAttendance } from '../../redux/slices/labAttendanceSlice'
import { replaceColonsToUnderscore } from '../../utility/help'
import { ALLOW_QR_SCAN } from '../../utility/constants'

const CandidateAttendance = (props, inputRef) => {
  const dispatch = useDispatch()
  const cameraControlsRef = useRef(null)

  const candidateInfo = useSelector((state) => state.candidateInfo)
  const connectionData = useSelector((state) => state.connectionData)

  const isQrScanAllow = useMemo(() => {
    if (connectionData?.projectConfig?.length > 0) {
      return connectionData.projectConfig.filter((_configKey) => {
        return _configKey.config_key == ALLOW_QR_SCAN
      })
    }
  })

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
      showErrorToast(err?.message || 'Something went wrong')
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
      console.log('Cleaning up...')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [candidateInfo.snapshotCaptured])

  function getImage(img, path) {
    if (!img) return null
    return `${connectionData.backendUrl}/${path}/${replaceColonsToUnderscore(img)}`
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
          <div className="mx-5">
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
                  {/* <!--FORM FILLING UPLOADED IMAGE --> */}
                  <div className="profile-holder w-[180px] aspect-[3/4] rounded-xl overflow-hidden">
                    <img
                      id="student-image"
                      src={getImage(
                        candidateInfo?.sl_image,
                        candidateInfo.candidateImageRelativePath
                      )}
                      onError={(e) => (e.target.src = NoImageAvailabePlaceholderImage)}
                      className="w-full h-full"
                    />
                  </div>

                  {/* <!--QR CAPTURED IMAGE --> */}
                  {isQrScanAllow?.length > 0 && isQrScanAllow[0]?.config_value === 'YES' && (
                    <div className="profile-holder w-[180px] aspect-[3/4] rounded-xl overflow-hidden">
                      <img
                        id="student-qr-image"
                        src={getImage(
                          candidateInfo?.sl_qr_image,
                          candidateInfo.candidateQRPhotoRelativePath
                        )}
                        onError={(e) => (e.target.src = NoImageAvailabePlaceholderImage)}
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  {/* <!-- ALREADY UPLOADED SIGN --> */}
                  <div className="sign-holder w-[17rem] h-[6rem] border rounded-xl overflow-hidden">
                    <img
                      id="student-sign"
                      src={getImage(
                        candidateInfo?.sl_sign,
                        candidateInfo.candidateImageRelativePath
                      )}
                      onError={(e) => {
                        e.target.src = NoImageAvailabePlaceholderImage
                      }}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Right part for photo capturing */}
              <div className="shadow-md rounded-[2rem] py-4 px-12 grid gap-3 grid-cols-2">
                <div className="justify-self-center">
                  <WebCamera
                    cameraControlsRef={cameraControlsRef}
                    isShowWebCam={
                      candidateInfo.sl_present_status != 1 &&
                      !candidateInfo.snapshotCaptured &&
                      !candidateInfo.justMarkedPresent
                    }
                    isShowCapturedImage={
                      candidateInfo.snapshotCaptured || candidateInfo.justMarkedPresent
                    }
                    capturedImagePath={candidateInfo.capturedWebcamImagePath}
                    isShowFetchedImage={
                      candidateInfo.sl_present_status == 1 && !candidateInfo.justMarkedPresent
                    }
                    fetchedImageRelativePath={candidateInfo.candidateWebcamImageRelativePath}
                    fetchedImageName={candidateInfo.sl_cam_image}
                  />
                </div>

                <div className="flex flex-col gap-2 justify-self-center">
                  {/*Buttons wont be visible if and only attendance is not marked */}
                  {candidateInfo.sl_present_status != 1 && (
                    <>
                      <button
                        type="button"
                        className="px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        id="take-snap-btn"
                        onClick={() => cameraControlsRef.current?.handleTakeSnap()}
                      >
                        Take Snap!
                      </button>

                      <button
                        type="button"
                        id="reset-btn"
                        className="px-8 py-4 border border-transparent text-lg font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => cameraControlsRef.current?.handleResetSnap()}
                      >
                        Reset
                      </button>

                      <button
                        type="button"
                        id="mark-present-btn"
                        className="px-8 py-4 border border-transparent text-lg font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={handleMarkCandidateAttendance}
                      >
                        Mark Present
                      </button>
                    </>
                  )}

                  {candidateInfo.sl_present_status == 1 && (
                    <div className="px-8 py-4 text-center border border-transparent text-lg font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      This candidate already marked present
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default forwardRef(CandidateAttendance)
