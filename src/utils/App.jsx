import { useState } from 'react'
import Header from '../components/header/header'
import './global.css'
import { Icons } from '../constants/icons'
import DashBoardCard from '../components/dashboardCard/daschBoardCard'
import GraficoDashBoard from '../components/GraficoDashBoard/Grafico'
import SideBar from '../components/SideBar/SideBar'

function App() {
  

  return (
 <>
 <div className="w-full  flex ">
   <SideBar/>
    <div className="flex flex-col">

  <Header
  logo={Icons.Logo}
  iconLinkedin={Icons.Linkedin}
  iconGithub={Icons.Github}
  iconInstagram={Icons.Instagram}
  />
  <div className="flex gap-12 flex-wrap justify-center items-center pt-3">

  <DashBoardCard
  titleCard="Vendas Do Dia "
  vendasTotal= "1.250,00"
  
  />
  <DashBoardCard
  titleCard="Vendas Do Mes "
  vendasTotal= "35.100,00"
  
  />
  </div>
  <div className="p-4">
    <GraficoDashBoard/>

  </div>
  
  </div>
  </div>
 </>
  )
}
export default App
