import { createSlice } from '@reduxjs/toolkit'

const intialConnectionData = {
  ipAddress: '',
  status: 'Disconnected', //'Connected',
  // status: 'Connected',
  protocol: '',
  port: '',
  backendUrl: ``,
  isSidebarOpen: false
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
    },
    toggleSidebar: (state, action) => {
      state.isSidebarOpen = action.payload
    }
  }
})

export const { setConnectionData, resetConnectionData, toggleSidebar } = connectionDataSlice.actions

export default connectionDataSlice.reducer
