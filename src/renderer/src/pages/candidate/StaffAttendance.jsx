import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Video from '../../components/candidate/video/Video'
import { setWebcamImage } from '../../redux/slices/candidateSlice'
import { showErrorToast, showSuccessToast } from '../../ui/Toasts'
import dataURLToBlob from '../../utility/dataUrlToBlob'

import Modal from '../../components/modals/BasicModal'
import { FiTrash } from 'react-icons/fi'
import { MdOutlineMailOutline } from 'react-icons/md'
import { PiOfficeChair } from 'react-icons/pi'
import { RiContactsLine } from 'react-icons/ri'
import { HiDesktopComputer } from 'react-icons/hi'

const StaffAttendance = () => {
  const staffFormDataRef = useRef(null)
  const candidateInfo = useSelector((state) => state.candidateInfo)
  const connectionData = useSelector((state) => state.connectionData)

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)
  const [labsList, setLabsList] = useState([])
  const [staffList, setStaffList] = useState([])

  const dispatch = useDispatch()

  const getLabsList = async () => {
    try {
      const url = `${connectionData.backendUrl}/api/attendence/v1/lab-list`
      const _labsList = await axios.get(url)
      const { success, data, message, error } = _labsList
      setLabsList(data?.data?._labList || [])
    } catch (err) {
      console.error(`Error while getting labs list: ${err}`)
      showErrorToast(err?.message || 'Something went wrong')
    }
  }

  const getStaffList = async () => {
    try {
      const url = `${connectionData.backendUrl}/api/staff/v1/list`
      const { data: resData } = await axios.get(url)
      console.log(resData)
      setStaffList(resData?.data || [])
    } catch (err) {
      console.error(`Error while getting staff list: ${err}`)
      showErrorToast(err?.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    getStaffList()
  }, [])

  useEffect(() => {
    if (isAddStaffModalOpen) {
      getLabsList()
    }
  }, [isAddStaffModalOpen])

  const handleSubmitStaffDetails = async (e) => {
    e?.preventDefault?.()

    if (!candidateInfo.snapshotCaptured) {
      showErrorToast(`Please Capture a Photo.`)
      return
    }

    try {
      const url = `${connectionData.backendUrl}/api/staff/v1/save-details `

      const formData = new FormData(staffFormDataRef.current)

      let candidatePhoto = dataURLToBlob(candidateInfo.capturedWebcamImagePath)
      formData.set('staff_photo', candidatePhoto)

      for (let [key, value] of formData) {
        console.log(key, value)
      }

      const { data: resData } = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Ensure the header is set correctly
        }
      })

      const { success, message } = resData

      if (success) {
        showSuccessToast(message || 'Attendance marked successfully')
        dispatch(
          setWebcamImage({
            snapshotCaptured: false,
            capturedWebcamImagePath: '',
            justMarkedPresent: true
          })
        )
      }
      setIsAddStaffModalOpen(false)
      getStaffList()
    } catch (err) {
      console.error(err.response.data.message, '-err')
      showErrorToast(err?.response?.data?.message || 'Something went wrong')
    }
  }

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
      <Modal isOpen={isAddStaffModalOpen} title="Staff Registration">
        <div className="container mx-auto w-[80vw] grid grid-cols-2">
          <div className="">
            <div className="p-4">
              <Video />
            </div>
          </div>

          <form
            ref={staffFormDataRef}
            id="staff-registration-form"
            className="bg-white p-8 rounded-2xl space-y-6 w-full"
          >
            <div>
              <label className="block text-gray-600 mb-1" for="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="staff_name"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1" for="mobile">
                Mobile
              </label>
              <input
                type="tel"
                id="mobile"
                name="staff_contact_number"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1" for="alloted-lab">
                Lab
              </label>
              <select
                id="alloted-lab"
                name="staff_alloted_lab"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">---Select---</option>
                {labsList.length > 0 &&
                  labsList?.map((lab) => {
                    return (
                      <option value={`${lab.lab_name}`}>
                        ({lab.lab_no}) {lab.lab_name}
                      </option>
                    )
                  })}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-1" for="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="staff_email"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1" for="aadhaar-number">
                Aadhaar Number
              </label>
              <input
                type="number"
                id="aadhaar-number"
                name="staff_aadhar_number"
                maxLength="12"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1" for="designation">
                Designation
              </label>
              <select
                id="designation"
                name="staff_designation"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">---Select---</option>
                {[
                  'Venue Head',
                  'IT Manager',
                  'Invigilator',
                  'Electrician',
                  'House Keeping Staff',
                  'Security'
                ].map((_el) => {
                  return <option value={_el}>{_el}</option>
                })}
              </select>
            </div>

            <div className="text-center grid grid-cols-2 gap-2">
              <button
                type="submit"
                onClick={handleSubmitStaffDetails}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all"
              >
                Submit
              </button>

              <button
                onClick={() => setIsAddStaffModalOpen(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <div className="container mx-auto mt-3">
        <button
          type="button"
          onClick={() => setIsAddStaffModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Staff
        </button>
      </div>

      <StaffCards staffList={staffList} getStaffList={getStaffList} />
    </>
  )
}

function StaffCards({ staffList, getStaffList }) {
  console.log(staffList)
  const connectionData = useSelector((state) => state.connectionData)

  const handleStaffDelete = async (staffId) => {
    if (!staffId) return
    try {
      const url = `${connectionData.backendUrl}/api/staff/v1/delete/${staffId}`
      const { data: resData } = await axios.delete(url)
      console.log(resData)
      getStaffList()
    } catch (err) {
      console.error(err)
      const error = err?.response?.data || {}
      showErrorToast(error?.errMsg || 'Something went wrong')
    }
  }

  return (
    <div className="grid grid-cols-4  gap-6 p-6">
      {staffList.length === 0 && <p>No staff list found</p>}
      {staffList.map((staff) => (
        <div
          key={staff.staff_id}
          className="bg-white shadow-md rounded-2xl pt-2 overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="w-48 h-48 rounded-full overflow-hidden flex mx-auto">
            <img
              src={`${connectionData.backendUrl}/pics/_staff_images/${staff.staff_photo}`}
              alt={staff.staff_name}
              className="w-full h-full object-fill"
            />
          </div>
          <div className="p-4 space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{staff.staff_name}</h2>

            <StaffInfo icon={<PiOfficeChair />} data={staff.staff_designation} />
            <StaffInfo icon={<RiContactsLine />} data={staff.staff_contact_number} />

            <StaffInfo icon={<MdOutlineMailOutline />} data={staff.staff_email} />

            <StaffInfo icon={<HiDesktopComputer />} data={staff.staff_alloted_lab} />

            <FiTrash
              className="text-red-500"
              onClick={handleStaffDelete.bind(null, staff.staff_id)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function StaffInfo({ icon, data }) {
  return (
    <p className="text-sm text-gray-600 flex items-center gap-2">
      <span className="text-xl">{icon}</span>

      <span>{data}</span>
    </p>
  )
}

export default StaffAttendance
