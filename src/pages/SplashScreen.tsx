import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => navigate("/welcome"), 2000);
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
            <img
                src={logo}
                alt="MilaTalk Logo"
                className="w-[80%] animate-pulse"
            />
        </div>
    );
};

export default SplashScreen;
