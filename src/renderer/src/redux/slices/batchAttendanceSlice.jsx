import { createSlice } from '@reduxjs/toolkit'

const initialBatchAttendanceState = {
  batch_total_students: '',
  batch_present_count: '',
  batch_attendance_not_marked: ''
}

const batchAttendanceSlice = createSlice({
  name: 'batchAttendance',
  initialState: initialBatchAttendanceState,
  reducers: {
    setBatchAttendance: (state, action) => {
      return { ...state, ...action.payload }
    }
  }
})

export const { setBatchAttendance } = batchAttendanceSlice.actions

export default batchAttendanceSlice.reducer
