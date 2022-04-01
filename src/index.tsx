import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { HashRouter } from "react-router-dom"
import { Main } from './main'
import 'antd/dist/antd.compact.css'
import './style.css'

ReactDOM.render(
  <HashRouter>
    <Main />
  </HashRouter>,
  document.getElementById('root')
)
