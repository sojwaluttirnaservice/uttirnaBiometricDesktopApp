import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const modalSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        openModal: (state, action) => {
            const modalId = action.payload
            state[modalId] = true
        },
        closeModal: (state, action) => {
            const modalId = action.payload
            state[modalId] = false
        },
        toggleModal: (state, action) => {
            const modalId = action.payload
            state[modalId] = !state[modalId]
        }
    }
})

export const { openModal, closeModal, toggleModal } = modalSlice.actions
export default modalSlice.reducer
