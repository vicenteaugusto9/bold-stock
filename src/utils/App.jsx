import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Importar os componentes de roteamento
import Header from "../components/header/header";
import "./global.css";
import DashBoardCard from "../components/dashboardCard/daschBoardCard";
import GraficoDashBoard from "../components/GraficoDashBoard/Grafico";
import SideBar from "../components/SideBar/SideBar";
import EstoquePage from '../pages/EstoquePage'; // Importar a página de Estoque

function App() {
  return (
    // BrowserRouter envolve toda a aplicação para habilitar o roteamento
    <BrowserRouter>
      <div className="flex w-max justify-center ">
        {/* SideBar e Header são componentes de layout que aparecem em todas as páginas */}
        <SideBar />
        <div className="flex flex-col w-full">
          <Header users="Administrador" />
          
          <Routes>
          
            <Route
              path="/"
              element={
                <div className="flex gap-12 flex-wrap items-center p-4">
                  <DashBoardCard />
                  {/* GraficoDashBoard também faz parte da página inicial */}
                
                </div>
              }
            />
            {/* Rota para a página de Estoque */}
            <Route path="/estoque" element={<EstoquePage />} />
            {/* Você pode adicionar mais rotas aqui conforme necessário */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
