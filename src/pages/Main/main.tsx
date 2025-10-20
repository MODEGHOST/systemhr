import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalLogin from "../Login/modallogin";

const Main = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/mainhr.jpg')" }}
    >
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg font-">SYSTEM HR</h1>
      <p className="text-lg mb-8 opacity-90">ระบบจัดการทรัพยากรบุคคล Support By BMU</p>

      <button
        onClick={() => setOpenLogin(true)}
        className="px-8 py-3 bg-[#ff7a1a] text-white font-bold rounded-full shadow-lg hover:bg-[#ff6a00] transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105"
      >
        เข้าสู่ระบบ
      </button>

      <ModalLogin
        open={openLogin}
        onCancel={() => setOpenLogin(false)}
        onLogin={(values) => {
          console.log("เข้าสู่ระบบโดยใช้:", values);
          setOpenLogin(false);
          navigate("/dashboard");
        }}
      />
    </div>
  );
};

export default Main;
