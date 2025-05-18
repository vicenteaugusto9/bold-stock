import { useState } from 'react'
import Header from '../components/header/header'
import './global.css'
import { Icons } from '../constants/icons'

function App() {
  

  return (
 <>
  <Header
  logo={Icons.Logo}
  iconLinkedin={Icons.Linkedin}
  iconGithub={Icons.Github}
  iconInstagram={Icons.Instagram}
  />
 </>
  )
}
export default App
