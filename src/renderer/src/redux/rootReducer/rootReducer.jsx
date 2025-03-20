import { combineReducers } from '@reduxjs/toolkit'
import candidateInfoReducer from '../slices/candidateSlice'
import totalAttendanceReducer from '../slices/totalAttendanceSlice'
import batchAttendanceReducer from '../slices/batchAttendanceSlice'
import labAttendanceReducer from '../slices/labAttendanceSlice'
import connectionDataReducer from '../slices/connectionDataSlice'
import userSliceReducer from '../slices/userSlice'

const rootReducer = combineReducers({
  candidateInfo: candidateInfoReducer,
  totalAttendance: totalAttendanceReducer,
  batchAttendance: batchAttendanceReducer,
  connectionData: connectionDataReducer,
  labAttendance: labAttendanceReducer,
  userSlice: userSliceReducer
})

export default rootReducer
