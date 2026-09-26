import { Route, Routes } from "react-router-dom"
import Cuenta from "./pages/Cuenta";

function App(){
  return(
    <Routes>
      <Route path="/:id" element={<Cuenta />} />
    </Routes>
  )
}

export default App;