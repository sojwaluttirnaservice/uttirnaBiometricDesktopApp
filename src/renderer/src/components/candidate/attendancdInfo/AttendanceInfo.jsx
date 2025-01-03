import axios from 'axios'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { showSuccessToast } from '../../../ui/Toasts'

// Component for individual attendance card
export const AttendanceCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-[#fff] shadow-md p-4 rounded-[2rem] flex flex-col justify-center">
      <div className="flex items-end gap-2">
        <p className={`value text-4xl ${color}`}>{value}</p>
        <i className={`fa-solid ${icon} mb-1 ${color}`} />
      </div>
      <div className="label total-status text-md text-[#555] font-semibold">{title}</div>
    </div>
  )
}

const AttendanceInfo = () => {
  const connectionData = useSelector((state) => state.connectionData)

  const candidateInfo = useSelector((state) => state.candidateInfo)
  const totalAttendance = useSelector((state) => state.totalAttendance)
  const batchAttendance = useSelector((state) => state.batchAttendance)
  const labAttendance = useSelector((state) => state.labAttendance)

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
    <div className="flex flex-col gap-4">
      <h3 className="text-center font-bold text-[#555]">Attendance Details</h3>

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
            LAB - <span className="text-[#F77935]">{candidateInfo.sl_lab_no}</span>
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
  )
}

export default AttendanceInfo
