import { useState } from "react";
import Header from "../components/header/header";
import "./global.css";
import { Icons } from "../constants/icons";
import DashBoardCard from "../components/dashboardCard/daschBoardCard";
import GraficoDashBoard from "../components/GraficoDashBoard/Grafico";
import SideBar from "../components/SideBar/SideBar";

function App() {
  return (
    <>
      <div className=" flex ">
        <SideBar />
        <div className="flex flex-col w-full ">
          <Header users="Administrador" />
          <div className="flex gap-12 flex-wrap items-center  p-4">
            <DashBoardCard  />
           
          </div>
          <div className="p-4">
            <GraficoDashBoard />
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
