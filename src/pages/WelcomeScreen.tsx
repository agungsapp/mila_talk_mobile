import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const WelcomeScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-between min-h-screen bg-primary text-white p-4">
            <div className="flex flex-col items-center">
                <img src={logo} alt="MilaTalk Logo" className="w-[80%] mb-4" />
                <h1 className="text-2xl font-bold mb-12">
                    Selamat Datang di MilaTalk!
                </h1>
            </div>
            <div>
                <button
                    onClick={() => navigate("/start")}
                    className="bg-gray-50 hover:bg-gray-200 text-primary font-bold px-6 py-3 rounded-full text-lg mb-4 w-full transition duration-300"
                >
                    Mulai Yuk
                </button>
                <button
                    onClick={() => navigate("/login")}
                    className="bg-transparent border-2 border-white hover:bg-white hover:text-orange-500 text-white px-6 py-3 rounded-full text-lg w-full transition duration-300"
                >
                    Aku Sudah Punya Akun
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;
