import { createSlice } from '@reduxjs/toolkit'

const initialBatchAttendanceState = {
  batch_total_students: 0,
  batch_present_count: 0,
  batch_attendance_not_marked: 0
}

const batchAttendanceSlice = createSlice({
  name: 'batchAttendance',
  initialState: initialBatchAttendanceState,
  reducers: {
    setBatchAttendance: (state, action) => {
      return { ...state, ...action.payload }
    },
    
    resetBatchAttendance: (state, action) => {
      return { ...initialBatchAttendanceState }
    }
  }
})

export const { setBatchAttendance, resetBatchAttendance } = batchAttendanceSlice.actions

export default batchAttendanceSlice.reducer
