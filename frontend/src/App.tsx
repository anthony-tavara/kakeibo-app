import { Route, Routes } from "react-router-dom";
import Cuenta from "./pages/Cuenta";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/:id" element={<Cuenta />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
