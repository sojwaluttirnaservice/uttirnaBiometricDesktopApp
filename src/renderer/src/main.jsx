// import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@fontsource/roboto' // Or '@fontsource/open-sans'
import { ToastContainer, toast } from 'react-toastify'

import store from './redux/store/store'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <HashRouter>
      <Provider store={store}>
        <App />
        <ToastContainer limit={3} />
      </Provider>
    </HashRouter>
  </>
)
