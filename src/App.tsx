import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout/layout";
import Main from "./pages/Main/main";
import AuthProvider from "./context/auth/AuthProvider";
import DashboardEmployee from "./pages/Dashboard/DashboardEmployee";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardEmployee />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen text-3xl font-semibold text-gray-600">
                404 | Page Not Found
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
