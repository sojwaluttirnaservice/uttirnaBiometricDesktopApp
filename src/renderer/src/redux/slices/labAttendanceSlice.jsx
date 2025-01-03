import { createSlice } from '@reduxjs/toolkit'

const initialLabAttendanceState = {
  lab_total_students: '11',
  lab_present_count: '11',
  lab_attendance_not_marked: '11'
}

const labAttendanceSlice = createSlice({
  name: 'labAttendance',
  initialState: initialLabAttendanceState,
  reducers: {
    setLabAttendance: (state, action) => {
      return { ...state, ...action.payload }
    }
  }
})

export const { setLabAttendance } = labAttendanceSlice.actions

export default labAttendanceSlice.reducer
