import axios from 'axios'
import React, { Suspense, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { showErrorToast, showSuccessToast } from '../../../ui/Toasts'
import { ModalBody, ModalDialog, ModalFooter, ModalHeader } from '../../modals/BasicModal'

// Component for individual attendance card
export const AttendanceCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-[#fff] shadow-md p-3 rounded-[2rem] flex flex-col justify-center">
      <div className="flex items-end justify-center gap-2">
        <p className={`value text-4xl ${color}`}>{value}</p>
        <i className={`fa-solid ${icon} mb-1 ${color}`} />
      </div>
      <div className="label total-status text-md text-[#555] font-semibold">{title}</div>
    </div>
  )
}

const ShowFullDayAttendanceModal = ({
  children,
  isOpen,
  setIsOpen,
  title = 'Modal Title',
  onConfirm = () => {},
  onClose = () => {
    setIsOpen(false)
  },
  isScrollable = false
}) => {
  const connectionData = useSelector((state) => state.connectionData)
  const [labwiseAttendanceCount, setLabwiseAttendanceCount] = useState(null)

  const handleFetchLabwiseAttendance = async () => {
    try {
      let url = `${connectionData.backendUrl}/api/attendence/v1/lab-wise-count`
      const { data: resData } = await axios.get(url)
      const { success, data, message } = resData

      if (success) {
        let { _labWiseCount } = data
        setLabwiseAttendanceCount(_labWiseCount)
      } else {
        setLabwiseAttendanceCount([])
        showErrorToast(message)
      }
    } catch (err) {
      console.log(err)
      showErrorToast(err)
    }
  }

  useEffect(() => {
    if (isOpen) {
      handleFetchLabwiseAttendance()
    }

    return () => {
      //clean
      setLabwiseAttendanceCount(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <ModalDialog width="w-[60rem]" height="h-[32rem]">
        <ModalHeader title={title} onClose={onClose} />

        {!labwiseAttendanceCount ? (
          <>
            <ModalBody>
              <h1 className="h-full py-4 text-indigo-500 text-4xl text-center font-bold tracking-wider">
                Loading..
              </h1>
            </ModalBody>
          </>
        ) : (
          <>
            {!labwiseAttendanceCount.length ? (
              <>
                <h1 className="h-full py-4 text-rose-500 italic text-4xl text-center font-bold tracking-wider">
                  No entry found in the labs list
                </h1>
              </>
            ) : (
              <>
                <div className="relative  shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <div className="sticky top-0">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="divide-x divide-gray-200 font-extrabold tracking-wider">
                          <th className="w-[16%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Lab Details
                          </th>
                          <th className="w-[16%] px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Shift
                          </th>
                          <th className="w-[16%] px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Present
                          </th>
                          <th className="w-[16%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">
                            Absent
                          </th>
                          <th className="w-[17.5%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">
                            Total
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
                <ModalBody isScrollable={isScrollable}>
                  <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    {/* <div style={{ position:"absolute"}} className="sticky top-0">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr className="divide-x divide-gray-200 font-extrabold tracking-wider">
                            <th className="w-[20%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Lab Details
                            </th>
                            <th className="w-[20%] px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Shift
                            </th>
                            <th className="w-[20%] px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Present
                            </th>
                            <th className="w-[20%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">
                              Absent
                            </th>
                            <th className="w-[20%] py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">
                              Total
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div> */}
                    <div className="grow">
                      <table className="relative  min-w-full divide-y divide-gray-300">
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {labwiseAttendanceCount.map((sinlgeLab) => (
                            <tr key={sinlgeLab.email} className="divide-x divide-gray-200">
                              <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-6">
                                {sinlgeLab.lab_name}
                              </td>
                              <td className="w-[20%] whitespace-nowrap p-4 text-sm text-gray-500">
                                {sinlgeLab.shift || '-'}
                              </td>
                              <td className="w-[20%] whitespace-nowrap p-4 text-sm text-gray-500">
                                {sinlgeLab.lab_present_count}
                              </td>
                              <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                {sinlgeLab.lab_attendance_not_marked}
                              </td>
                              <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                {sinlgeLab.lab_total_students}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <table className="relative min-w-full divide-y divide-gray-300">
                      <tfoot>
                        <tr className="divide-x divide-gray-200">
                          <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold text-gray-900 sm:pl-6 ">
                            All Labs
                          </td>
                          <td className="w-[20%] whitespace-nowrap p-4 text-sm text-gray-500"></td>
                          <td className="w-[20%] whitespace-nowrap p-4 text-sm text-emerald-500 font-bold">
                            {labwiseAttendanceCount.reduce(
                              (acc, curr) => acc + curr.lab_present_count,
                              0
                            )}
                          </td>
                          <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm text-rose-500 font-bold sm:pr-6">
                            {labwiseAttendanceCount.reduce(
                              (acc, curr) => acc + curr.lab_attendance_not_marked,
                              0
                            )}
                          </td>
                          <td className="w-[20%] whitespace-nowrap py-4 pl-4 pr-4 text-sm text-sky-500 font-bold sm:pr-6">
                            {labwiseAttendanceCount.reduce(
                              (acc, curr) => acc + curr.lab_total_students,
                              0
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </ModalBody>
              </>
            )}
          </>
        )}

        <ModalFooter onClose={onClose} />
      </ModalDialog>
    </div>
  )
}

const AttendanceInfo = () => {
  const connectionData = useSelector((state) => state.connectionData)

  const candidateInfo = useSelector((state) => state.candidateInfo)
  const totalAttendance = useSelector((state) => state.totalAttendance)
  const batchAttendance = useSelector((state) => state.batchAttendance)
  const labAttendance = useSelector((state) => state.labAttendance)

  const [isShowFullDayAttendanceModalOpen, setIsShowFullDayAttendanceModalOpen] = useState(false)

  // TODO: fetch the data from the server and get the details every time
  const handleFetchAllAttendanceStatus = async () => {
    const url = `${connectionData.backendUrl}/api/attendence/v1/mark-present`

    // const { data: resData } = await axios.get(``)

    // const {} = resData

    // SIMULATING THE PROMISE
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 2000) // simulate delay for 2 seconds
    })

    // showSuccessToast('Fetched data successfully')

    // TODO: Update the state with the fetched data
    // dispatch(setTotalAttendance());
    // dispatch(setBatchAttendance());
    // dispatch(setLabAttendance());
  }

  // Effect to fetch attendance data when the component mounts and then every 5 seconds

  useEffect(() => {
    // Define a function that calls the fetch and sets the next timeout
    //TODO: ACTIVATE THSI LATER
    const fetchData = async () => {
      await handleFetchAllAttendanceStatus() // Fetch data

      // Schedule the next fetch after 5 seconds
      setTimeout(fetchData, 5000) // Call the fetch function again after 5 seconds
    }

    fetchData() // Call the function once immediately when the component mounts

    // Cleanup (No need for clearInterval, since we're using setTimeout)
    return () => {
      // Any additional cleanup if needed
    }
  }, [])

  return (
    <>
      {/* Modal for full day attendance */}

      <ShowFullDayAttendanceModal
        isOpen={isShowFullDayAttendanceModalOpen}
        setIsOpen={setIsShowFullDayAttendanceModalOpen}
        isScrollable={true}
        title={'Full Day Attendance'}
      />

      <div className="flex flex-col gap-4">
        <h3 className="flex items-center justify-center font-bold text-[#555]">
          Attendance Details
          <span className="inline-block ms-auto">
            <button
              className="px-4 py-1 border border-emerald-600 rounded text-emerald-600"
              type="button"
              onClick={(e) => setIsShowFullDayAttendanceModalOpen(true)}
            >
              Full Day Attendance
            </button>
          </span>
        </h3>

        <div className="attendance-details grow">
          <div className="flex flex-col justify-between gap-1">
            {/* Upper box for total count */}
            {/* KEEPING IT HIDDEN BECAUSE NOT NECCESSARY NOW */}
            <div className="hidden" id="allbatches-count">
              <div className="flex items-center justify-between gap-2">
                <AttendanceCard
                  title="Total Alloted"
                  value={totalAttendance.total_students}
                  icon="fa-users"
                  color="text-[#43A7FF]"
                />
                <AttendanceCard
                  title="Total Present"
                  value={totalAttendance.present_count}
                  icon="fa-user-check"
                  color="text-[#43A7FF]"
                />
                <AttendanceCard
                  title="Total Absent"
                  value={totalAttendance.attendance_not_marked}
                  icon="fa-user-xmark"
                  color="text-[#F77935]"
                />
              </div>
            </div>

            {/* Batch/POST Information */}
            <div className="value text-center font-semibold text-lg text-[#43A7FF]">
              Batch - <span className="text-[#F77935]">{candidateInfo.sl_batch_no}</span>
            </div>

            {/* Lower box for batch attendance */}
            <div id="batchwise-count">
              <div className="flex items-center justify-between gap-2">
                <AttendanceCard
                  title="Total Alloted"
                  value={batchAttendance.batch_total_students}
                  icon="fa-users"
                  color="text-[#43A7FF]"
                />
                <AttendanceCard
                  title="Total Present"
                  value={batchAttendance.batch_present_count}
                  icon="fa-user-check"
                  color="text-[#43A7FF]"
                />
                <AttendanceCard
                  title="Total Absent"
                  value={batchAttendance.batch_attendance_not_marked}
                  icon="fa-user-xmark"
                  color="text-[#F77935]"
                />
              </div>
            </div>

            {/* Lab Information */}
            <div className="value text-center font-semibold text-lg text-[#43A7FF]">
              LAB - <span className="text-[#F77935]">{candidateInfo.lab_name}</span>
            </div>

            {/* Lower box for lab attendance */}
            <div id="labwise-count">
              <div className="flex items-center justify-between gap-2">
                <AttendanceCard
                  title="Total Alloted"
                  value={labAttendance.lab_total_students}
                  icon="fa-users"
                  color="text-[#43A7FF]"
                />
                <AttendanceCard
                  title="Total Present"
                  value={labAttendance.lab_present_count}
                  icon="fa-user-check"
                  color="text-[#43A7FF]"
                />
                <AttendanceCard
                  title="Total Absent"
                  value={labAttendance.lab_attendance_not_marked}
                  icon="fa-user-xmark"
                  color="text-[#F77935]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AttendanceInfo
