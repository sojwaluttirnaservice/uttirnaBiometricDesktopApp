import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setWebcamImage } from '../../../redux/slices/candidateSlice'
import NoImageAvailabePlaceholderImage from '../../../assets/static-images/no-image-placeholder.svg.png'
import { showErrorToast, showSuccessToast } from '../../../ui/Toasts'
import ErrorModal from '../../modals/confirmationModals/ErrorModal'

const Video = () => {
  const connectionData = useSelector((state) => state.connectionData)
  const dispatch = useDispatch()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const candidateInfo = useSelector((state) => state.candidateInfo)

  const [cameraError, setCameraError] = useState('')
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false) // track retry status

  // Crop dimensions
  const cropWidth = 180 // Width of the cropped video
  const cropHeight = (4 * cropWidth) / 3

  const accessCamera = async () => {
    setIsRetrying(true) // Start retrying
    // Access the user's camera

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const video = videoRef.current

      if (video) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
          cropLiveVideo()
        })
      }
      showSuccessToast('Camera is Accessible')
      setCameraError('')
      setIsCameraModalOpen(false) // Hide modal on success
    } catch (err) {
      console.error('Error accessing camera:', err)
      if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
        setCameraError('Camera not found or permission denied.')
      } else {
        setCameraError(`Unable to access camera: ${err.message}`)
      }
      setIsCameraModalOpen(true) // Show error modal
    } finally {
      setIsRetrying(false) // Reset retry status after operation
    }
  }
  useEffect(() => {
    accessCamera() // Try to access camera on mount or when these states change
  }, [candidateInfo.id, candidateInfo.snapshotCaptured, candidateInfo.justMarkedPresent])

  const handleRetryAction = () => {
    accessCamera() // Retry camera access
  }

  const cropLiveVideo = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')

    canvas.width = cropWidth
    canvas.height = cropHeight

    const drawCrop = () => {
      // Calculate cropping coordinates (centered)
      const cropX = (video.videoWidth - cropWidth) / 2
      const cropY = (video.videoHeight - cropHeight) / 2

      // Clear the canvas
      ctx.clearRect(0, 0, cropWidth, cropHeight)

      // Draw the cropped portion of the video on the canvas
      ctx.drawImage(
        video, // Source video
        cropX, // Crop start X
        cropY, // Crop start Y
        cropWidth, // Crop width
        cropHeight, // Crop height
        0, // Canvas X
        0, // Canvas Y
        cropWidth, // Canvas width
        cropHeight // Canvas height
      )

      // Loop for continuous cropping
      requestAnimationFrame(drawCrop)
    }

    // Start cropping
    drawCrop()
  }

  const handleTakeSnap = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/jpeg') // Change 'image/jpeg' to 'image/png' if needed
      console.log(dataUrl)
      dispatch(
        setWebcamImage({
          snapshotCaptured: true,
          capturedWebcamImagePath: dataUrl,
          justMarkedPresent: true
        })
      )
    }
  }

  const handleResetSnap = (e) => {
    e.preventDefault()
    dispatch(
      setWebcamImage({
        snapshotCaptured: false,
        capturedWebcamImagePath: '',
        justMarkedPresent: false
      })
    )
  }

  return (
    <>
      {/* Camera Error Modal */}
      <ErrorModal
        isOpen={isCameraModalOpen}
        setIsOpen={setIsCameraModalOpen}
        onRetry={handleRetryAction}
        hideClose={true}
        errorMessage={cameraError}
        isRetrying={isRetrying} // Pass retry state to modal
      />

      <div className="w-full">
        <div className="w-full flex items-center justify-between">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ display: 'none' }} // Hide the video element
          />

          {/* Video should be only visible in either case(
        1. When attendance is not marked 
        2. And if attendance is not marked & when we have not captured the image on local or not just captured
        ) */}

          {candidateInfo.sl_present_status != 1 &&
            !candidateInfo.snapshotCaptured &&
            !candidateInfo.justMarkedPresent && (
              <>
                <canvas
                  ref={canvasRef}
                  style={{
                    border: '',
                    display: 'block'
                  }}
                />
              </>
            )}

          {/* CONDITION 1 */}

          {/* 
        1. Candidate attendance statsu is fetched from the server
        2. Candidate has already captured webcam image
        3. Image is not capture just now i.e. on local just now*/}
          {candidateInfo.sl_present_status == 1 && !candidateInfo.justMarkedPresent && (
            <>
              <div className="profile-holder w-[180px] aspect-[3/4]  overflow-hidden">
                <img
                  id="student-image"
                  src={`${connectionData.backendUrl}/${candidateInfo.candidateWebcamImageRelativePath}/${candidateInfo.sl_cam_image}`}
                  onError={(e) => (e.target.src = NoImageAvailabePlaceholderImage)}
                  className="w-full h-full"
                />
              </div>
            </>
          )}

          {/* CONDITION 2 */}
          {/* If snapshot captured and or just marked present, show the capture image url
           */}
          {(candidateInfo.snapshotCaptured || candidateInfo.justMarkedPresent) && (
            <>
              <img src={candidateInfo.capturedWebcamImagePath} alt="" />
            </>
          )}

          <div>
            {/*Buttons wont be visible if and only attendance is not marked */}
            {candidateInfo.sl_present_status != 1 && (
              <>
                <div className="flex flex-col gap-4 ">
                  <button
                    type="button"
                    className="px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="take-snap-btn"
                    onClick={handleTakeSnap}
                  >
                    Take Snap
                  </button>

                  <button
                    type="button"
                    id="reset-btn"
                    className="px-8 py-4 border border-transparent text-lg font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleResetSnap}
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Video
