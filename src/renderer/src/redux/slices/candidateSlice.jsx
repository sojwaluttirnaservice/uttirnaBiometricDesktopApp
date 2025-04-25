import { createSlice } from '@reduxjs/toolkit'

let initialCandidateInfo = {
  // Basic Identification
  id: '', // Candidate's unique identifier
  full_name: '', // Candidate's full name

  // Application and Post Details
  sl_application_number: '', // Candidate's application number
  sl_post: '', // Post applied for by the candidate

  // Personal Information
  sl_date_of_birth: '', // Date of birth (original format)
  dob: '', // Date of birth (formatted, if required)

  // Exam Details
  exam_date: '', // Date of the examination
  exam_time: '', // Time of the examination
  sl_batch_no: '', // Batch number assigned for the examination
  sl_present_status: '', // Attendance or presence status in the exam

  // Candidate Images
  sl_image: '', // Path to the candidate's saved image
  sl_sign: '', // Path to the candidate's saved signature
  sl_cam_image: '', // Path to the candidate's image captured on camera
  lab_name: '',
  lab_no: '',
  department: '',
  floor: '',
  center_id: '',
  capturedWebcamImagePath: '',
  snapshotCaptured: false,
  justMarkedPresent: false,

  // Relative Paths for Media (optional but included for clarity)
  candidateImageRelativePath: 'pics/_images', // Relative path for the candidate's image
  candidateSignRelativePath: 'pics/_sign', // Relative path for the candidate's signature,
  candidateWebcamImageRelativePath: '/pics/_webcam_images/'
}

const candidateInfoSlice = createSlice({
  name: 'candidateInfo',
  initialState: initialCandidateInfo,

  reducers: {
    setCandidateInfo: (state, action) => {
      console.log(action.payload)
      let newInfo = { ...state, ...action.payload }
      return newInfo
    },

    setWebcamImage: (state, action) => {
      const { snapshotCaptured, capturedWebcamImagePath, justMarkedPresent } = action.payload
      if (snapshotCaptured != undefined) {
        state.snapshotCaptured = snapshotCaptured
      }
      if (capturedWebcamImagePath != undefined) {
        state.capturedWebcamImagePath = capturedWebcamImagePath
      }
      if (justMarkedPresent != undefined) {
        state.justMarkedPresent = justMarkedPresent
      }
    },

    setCandidateAttendanceStatus: (state, action) => {
      let newAttendanceStatus = action.payload
      state.sl_present_status = newAttendanceStatus
    },

    resetCandidateInfo: (state, action) => {
      return { ...initialCandidateInfo }
    }
  }
})

export const {
  setCandidateInfo,
  setWebcamImage,
  setCandidateAttendanceStatus,
  resetCandidateInfo
} = candidateInfoSlice.actions

export default candidateInfoSlice.reducer
