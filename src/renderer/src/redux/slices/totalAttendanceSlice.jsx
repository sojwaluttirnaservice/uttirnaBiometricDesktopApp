import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialTotalAttendanceState = {
  total_students: 0,
  present_count: 0,
  attendance_not_marked: 0
}

// Slice
const totalAttendanceSlice = createSlice({
  name: 'totalAttendance',
  initialState: initialTotalAttendanceState,
  reducers: {
    setTotalAttendance: (state, action) => {
      const newTotalAttendance = { ...state, ...action.payload }
      return newTotalAttendance
    },
    
    resetTotalAttendance: (state, action) => {
      return { ...initialTotalAttendanceState }
    }
  }
})

// Export the actions and reducer
export const { setTotalAttendance , resetTotalAttendance} = totalAttendanceSlice.actions
export default totalAttendanceSlice.reducer
