import { useSelector } from 'react-redux'
import { AttendanceCard } from './AttendanceCard'

const AttendanceInfo = () => {
  const candidateInfo = useSelector((state) => state.candidateInfo)
  const batchAttendance = useSelector((state) => state.batchAttendance)

  return (
    <>
      <div className="flex flex-col gap-4">
        <h3 className="flex items-center justify-center font-bold text-[#555]">
          Attendance Details
          {/* <span className="inline-block ms-auto">
            <button
              className="px-4 py-1 border border-emerald-600 bg-red-400 rounded-lg text-white hover:bg-red-500 hover:shadow-md"
              type="button"
              onClick={(e) => dispatch(openModal('fullDayAttendance'))}
            >
              Full Day Attendance
            </button>
          </span> */}
        </h3>

        <div className="attendance-details grow">
          <div className="flex flex-col justify-between gap-1">
            {/* Batch/POST Information */}
            <div className="value text-center font-semibold text-lg text-[#43A7FF]">
              Batch - <span className="text-[#F77935]">{candidateInfo.sl_batch_no}</span>
            </div>

            {/* Lower box for batch attendance */}
            <div id="batchwise-count">
              {/* <div className="flex items-center justify-between gap-2"> */}
              <div className="grid grid-cols-3 gap-3 text-center">
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
          </div>
        </div>
      </div>
    </>
  )
}

export default AttendanceInfo
