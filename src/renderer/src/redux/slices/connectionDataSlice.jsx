import { createSlice } from '@reduxjs/toolkit'

const intialConnectionData = {
  ipAddress: '',
  status: 'Disconnected', //'Connected',
  // status: 'Connected',
  protocol: '',
  port: '',
  backendUrl: ``
}

const connectionDataSlice = createSlice({
  name: 'connectionData',
  initialState: intialConnectionData,
  reducers: {
    setConnectionData: (state, action) => {
      return { ...state, ...action.payload }
    },
    resetConnectionData: (state, action) => {
      return { ...intialConnectionData }
    }
  }
})

export const { setConnectionData, resetConnectionData } = connectionDataSlice.actions

export default connectionDataSlice.reducer
