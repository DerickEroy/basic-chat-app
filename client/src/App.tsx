import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "./modules/register/pages/RegisterPage";
import LoginPage from "./modules/login/pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
    </BrowserRouter>
  )
}