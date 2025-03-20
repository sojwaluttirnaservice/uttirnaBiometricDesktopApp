import { createSlice } from '@reduxjs/toolkit'
import { showSuccessToast } from '../../ui/Toasts'

const initialUserState = {
  username: null,
  password: null,
  userRole: 'BIOMETRIC',
  isLoggedIn: false
}

const userSlice = createSlice({
  initialState: initialUserState,
  name: 'userSlice',
  reducers: {
    loginUser: (state, action) => { 
      return { ...state, ...action.payload }
    }, 

    logoutUser: (state, action) => {
      return { ...initialUserState }
    }
  }
})

export const { loginUser, logoutUser } = userSlice.actions

export default userSlice.reducer
