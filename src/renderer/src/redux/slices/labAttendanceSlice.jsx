import { createSlice } from '@reduxjs/toolkit'

const initialLabAttendanceState = {
  lab_total_students: 0,
  lab_present_count: 0,
  lab_attendance_not_marked: 0
}

const labAttendanceSlice = createSlice({
  name: 'labAttendance',
  initialState: initialLabAttendanceState,
  reducers: {
    setLabAttendance: (state, action) => {
      return { ...state, ...action.payload }
    },

    resetLabAttendance: (state, action) => {
      return { ...initialLabAttendanceState }
    }
  }
})

export const { setLabAttendance, resetLabAttendance } = labAttendanceSlice.actions

export default labAttendanceSlice.reducer
