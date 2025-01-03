import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialTotalAttendanceState = {
  total_students: '',
  present_count: '',
  attendance_not_marked: ''
}

// Slice
const totalAttendanceSlice = createSlice({
  name: 'totalAttendance',
  initialState: initialTotalAttendanceState,
  reducers: {
    setTotalAttendance: (state, action) => {
      const newTotalAttendance = { ...state, ...action.payload }
      return newTotalAttendance
    }
  }
})

// Export the actions and reducer
export const { setTotalAttendance } = totalAttendanceSlice.actions
export default totalAttendanceSlice.reducer
