
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashBoardCard from '../pages/dashboard';
import EstoquePage from '../pages/EstoquePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoardCard />} />
        <Route path="/estoque" element={<EstoquePage />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;