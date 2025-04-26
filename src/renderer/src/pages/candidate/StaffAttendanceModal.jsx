import { memo, useEffect, useRef, useState } from 'react'
import Modal from '../../components/modals/BasicModal'
import Video from '../../components/candidate/video/Video'
import Video2 from '../../components/candidate/video/Video2'
import { BiCamera } from 'react-icons/bi'
import { showErrorToast, showSuccessToast } from '../../ui/Toasts'
import dataURLToBlob from '../../utility/dataUrlToBlob'
import axios from 'axios'

const initialWebcamImageState = {
  snapshotCaptured: false,
  capturedWebcamImagePath: '',
  justMarkedPresent: false,
  currentAttendanceStaffId: null
}

function StaffAttendanceModal({
  isShowattendanceModal,
  setIsShowattendanceModal,
  staffList,
  connectionData
}) {
  const [isCapturePhotoModalOpen, setIsCapturePhotoModalOpen] = useState(false)
  const [batches, setBatches] = useState([])
  const [staffListWithAttendance, setStaffListWithAttendance] = useState([])
  const batchDropdownRef = useRef(null)

  const fetchBatches = async () => {
    try {
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

  useEffect(() => {
    if (batches.length === 0) {
      fetchBatches()
    }
  }, [batches])

  const [webcamImage, setWebcamImage] = useState(initialWebcamImageState)

  const markStaffAttendance = async (staffId) => {
    if (!staffId) {
      showErrorToast('Invalid staff id')
      return
    }

    if (!webcamImage.snapshotCaptured) {
      showErrorToast(`Please Capture a Photo.`)
      return
    }

    try {
      const url = `${connectionData.backendUrl}/api/staff/v1/mark-attendance`

      const formData = new FormData()

      let staffPhoto = dataURLToBlob(webcamImage.capturedWebcamImagePath)
      formData.set('staff_id', staffId)
      formData.set('shift', batchDropdownRef.current.value)
      formData.set('staff_photo', staffPhoto)
      formData.set('attendance_status', 'PRESENT')

      const { data: resData } = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Ensure the header is set correctly
        }
      })

      const { success, message } = resData

      if (success) {
        showSuccessToast(message || 'Attendance marked successfully')
        setWebcamImage(initialWebcamImageState)
        setIsCapturePhotoModalOpen(false)
        handleGetStaffAttendanceBatchWise()
      }
    } catch (err) {
      console.error(err)
      showErrorToast(err?.response?.data?.message || 'Something went wrong')
    }
  }

  async function handleGetStaffAttendanceBatchWise() {
    // '/v1/staff-attendance-batchwise/:batchId'

    try {
      const batchId = batchDropdownRef.current.value
      if (!batchId) {
        batchDropdownRef.current.focus()
        showErrorToast('Please select batch')
        setStaffListWithAttendance([])
        return
      }

      const url = `${connectionData.backendUrl}/api/staff/v1/staff-attendance-batchwise/${batchId}`

      const { data: resData } = await axios.get(url)

      const { success, data: staffAttendance, message } = resData

      // setting present if staff is present
      let updatedStaffList = staffList.map((staff) => {
        const attStatus = staffAttendance.find((staffAtt) => staff.staff_id === staffAtt.staff_id)
        return {
          ...staff,
          attendance_status: attStatus?.attendance_status || 'ABSENT',
          captured_photo: attStatus?.staff_photo || null
        }
      })

      setStaffListWithAttendance(updatedStaffList)

      showSuccessToast(message || 'Successfully')
    } catch (err) {
      console.error(err)
      showErrorToast(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setWebcamImage(initialWebcamImageState)
    }
  }

  useEffect(() => {
    setStaffListWithAttendance([])
  }, [isShowattendanceModal])

  return (
    <>
      <Modal
        isOpen={isShowattendanceModal}
        title="Staff Attendance"
        onClose={() => setIsShowattendanceModal(false)}
      >
        <div className="pb-2 flex gap-2 items-end">
          <div>
            <select
              ref={batchDropdownRef}
              id="alloted-lab"
              name="staff_alloted_lab"
              onChange={handleGetStaffAttendanceBatchWise}
              className=" p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">---Select Batch---</option>
              {batches.length > 0 &&
                batches?.map((lab) => {
                  return (
                    <option key={lab.sl_batch_no} value={`${lab.sl_batch_no}`}>
                      Batch-{lab.sl_batch_no}
                    </option>
                  )
                })}
            </select>
          </div>
        </div>
        <div className="max-h-96 overflow-scroll">
          <table className="w-[60vw] bg-white border border-gray-200 rounded-xl shadow-sm">
            <thead className="bg-gray-100 text-left text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Photo</th>
                <th className="px-6 py-3 ">Captured Photo</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {staffListWithAttendance.map((staff) => (
                <tr key={staff.staff_id} className="border-t">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center flex-col">
                      <span>{staff.staff_name}</span>
                      <span className="bg-sky-500 px-2 text-xs py-1 w-fit rounded-full text-center text-white font-semibold">
                        {staff.staff_designation}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src={`${connectionData.backendUrl}/pics/_staff_images/${staff.staff_photo}`}
                      alt={staff.staff_name}
                      className="h-24 w-24 rounded-sm object-cover border"
                    />
                  </td>

                  <td className="px-6 py-4">
                    {staff?.attendance_status === 'PRESENT' && (
                      <img
                        src={`${connectionData.backendUrl}/pics/_staff_attendance_images/${staff.captured_photo}`}
                        alt={staff.staff_name}
                        className="h-24 w-24 rounded-sm object-cover border"
                      />
                    )}
                    <div className="flex justify-center">
                      {staff.attendance_status === 'ABSENT' && (
                        <BiCamera
                          className="w-10 h-10 cursor-pointer"
                          onClick={() => {
                            setIsCapturePhotoModalOpen(true)
                            setWebcamImage((prev) => {
                              return {
                                ...prev,
                                currentAttendanceStaffId: staff.staff_id
                              }
                            })
                          }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {staff.attendance_status === 'PRESENT' && (
                        <p className="bg-green-500 p-2 rounded-full text-white font-semibold">
                          PRESENT
                        </p>
                      )}

                      {staff.attendance_status === 'ABSENT' && (
                        <p className="bg-red-500 p-2 rounded-full text-white font-semibold">
                          ABSENT
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        isOpen={isCapturePhotoModalOpen}
        title="Capture Photo"
        onClose={() => {
          setWebcamImage(initialWebcamImageState)
          setIsCapturePhotoModalOpen(false)
        }}
      >
        <div className="min-w-[30vw] p-3">
          <Video2
            markStaffAttendance={markStaffAttendance}
            setWebcamImage={setWebcamImage}
            webcamImage={webcamImage}
            staff_id={webcamImage.currentAttendanceStaffId}
            isCapturePhotoModalOpen={isCapturePhotoModalOpen}
          />
        </div>
      </Modal>
    </>
  )
}

export default memo(StaffAttendanceModal)
