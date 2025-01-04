import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetCandidateInfo } from '../../../redux/slices/candidateSlice'
import { resetBatchAttendance } from '../../../redux/slices/batchAttendanceSlice'
import { resetTotalAttendance } from '../../../redux/slices/totalAttendanceSlice'

const CandidateInfo = () => {
  const candidateInfo = useSelector((state) => state.candidateInfo)
  const dispatch = useDispatch()

  useEffect(() => {
    // WHEN IT WILL UNMOUNT, RESET THE CANDIATE DETIALS ALONG WITH ALL OTEHR DETIALS
    return () => {
      dispatch(resetCandidateInfo())
      dispatch(resetTotalAttendance())
      dispatch(resetBatchAttendance())
    }
  }, [])

  return (
    <>
      <div className="h-full  flex flex-col gap-4">
        <h3 className="text-center font-bold text-[#555]">Candidate Details</h3>
        <div className="candidate-info">
          <div className="grid grid-cols-3 col-span-3 gap-3 shadow-md p-6 rounded-[2rem]">
            <div className="col-span-2 flex items-center gap-3">
              <i className="fa-solid fa-user  text-[#43A7FF] text-xl"></i>
              <div>
                <div className="label font-semibold text-[#555] text-md">Name</div>
                <div className="value font-semibold text-lg text-[#43A7FF]" id="name">
                  {candidateInfo.full_name}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-calendar-days text-xl text-[#43A7FF]"></i>
              <div>
                <div className="label font-semibold text-[#555] text-md">DOB</div>
                <div className="value font-semibold text-lg text-[#43A7FF]" id="dob">
                  {candidateInfo.dob}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-layer-group text-xl text-[#43A7FF]"></i>
              <div>
                <div className="label font-semibold text-[#555] text-md">Exam Date</div>
                <div className="value font-semibold text-lg text-[#43A7FF]" id="exam-date">
                  {candidateInfo.exam_date}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="fa-solid fa-layer-group text-xl text-[#43A7FF]"></i>
              <div>
                <div className="label font-semibold text-[#555] text-md">Exam Time</div>
                <div className="value font-semibold text-lg text-[#43A7FF]" id="exam-date">
                  -
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="fa-solid fa-layer-group text-xl text-[#43A7FF]"></i>
              <div>
                <div className="label font-semibold text-[#555] text-md">Batch</div>
                <div className="value font-semibold text-lg text-[#43A7FF]" id="batch">
                  Batch - <span className="text-[#F77935]">{candidateInfo.sl_batch_no}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="fa-solid fa-id-card-clip text-xl text-[#43A7FF]"></i>
              <div>
                <div className="label font-semibold text-[#555] text-md">User Id</div>
                <div className="value font-semibold text-lg text-[#43A7FF]" id="username">
                  {candidateInfo.id}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-id-card text-xl text-[#43A7FF]"></i>
              <div>
                <div className="label font-semibold text-[#555] text-md">Application No.</div>
                <div className="value font-semibold text-lg text-[#43A7FF]" id="application-number">
                  {candidateInfo.sl_application_number}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-id-card text-xl text-[#43A7FF]"></i>
              <div>
                <div className="label font-semibold text-[#555] text-md">Post</div>
                <div className="value font-semibold text-lg text-[#43A7FF]" id="post">
                  {candidateInfo.sl_post}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CandidateInfo
