import React from 'react'
import ReactDOM from 'react-dom'
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import registerServiceWorker from './registerServiceWorker'
import App from './frontend/App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'typeface-roboto'

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'))

registerServiceWorker()