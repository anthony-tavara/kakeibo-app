import { Route, Routes } from "react-router-dom";
import Cuenta from "./pages/Cuenta";
import NotFound from "./components/NotFound";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:id" element={<Cuenta />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
