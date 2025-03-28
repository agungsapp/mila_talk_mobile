import { useNavigate } from "react-router-dom";
import character from "../assets/character.png";

const StartScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-4">
            <div className="bg-white p-4 rounded-lg shadow-lg mb-8 w-full max-w-sm relative">
                <p className="text-lg font-semibold text-gray-800">
                    "Apakah kamu sudah siap?"
                </p>
                <div className="absolute -bottom-2 left-4 w-0 h-0 border-t-8 border-t-white border-x-8 border-x-transparent"></div>
            </div>
            <img src={character} alt="Character" className="w-48 mb-8" />
            <button
                onClick={() => navigate("/register")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full text-lg w-full max-w-sm transition duration-300"
            >
                Lanjut
            </button>
        </div>
    );
};

export default StartScreen;
