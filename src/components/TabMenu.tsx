import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface TabMenuProps {
    activeTab: string;
}

const TabMenu = ({ activeTab }: TabMenuProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-orange-500 shadow-lg border-t border-orange-600">
            <div className="flex justify-around py-2 relative">
                <button
                    onClick={() => navigate("/home")}
                    className={`flex flex-col items-center p-2 w-full text-white transition-all duration-300 ${
                        activeTab === "home"
                            ? "scale-110"
                            : "text-orange-200 hover:text-white"
                    }`}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7m-9 2v10a2 2 0 002 2h4a2 2 0 002-2V12"
                        />
                    </svg>
                    <span className="text-xs mt-1">Home</span>
                    {activeTab === "home" && (
                        <span className="absolute bottom-0 h-1 w-12 bg-white rounded-t-full animate-tab-slide" />
                    )}
                </button>

                <button
                    onClick={() => navigate("/kelas")}
                    className={`flex flex-col items-center p-2 w-full text-white transition-all duration-300 ${
                        activeTab === "kelas"
                            ? "scale-110"
                            : "text-orange-200 hover:text-white"
                    }`}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                    <span className="text-xs mt-1">Kelas</span>
                    {activeTab === "kelas" && (
                        <span className="absolute bottom-0 h-1 w-12 bg-white rounded-t-full animate-tab-slide" />
                    )}
                </button>

                <button
                    onClick={() => navigate("/kuis")}
                    className={`flex flex-col items-center p-2 w-full text-white transition-all duration-300 ${
                        activeTab === "kuis"
                            ? "scale-110"
                            : "text-orange-200 hover:text-white"
                    }`}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01"
                        />
                    </svg>
                    <span className="text-xs mt-1">Kuis</span>
                    {activeTab === "kuis" && (
                        <span className="absolute bottom-0 h-1 w-12 bg-white rounded-t-full animate-tab-slide" />
                    )}
                </button>

                <button
                    onClick={() => navigate("/profile")}
                    className={`flex flex-col items-center p-2 w-full text-white transition-all duration-300 ${
                        activeTab === "profil"
                            ? "scale-110"
                            : "text-orange-200 hover:text-white"
                    }`}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    <span className="text-xs mt-1">Profil</span>
                    {activeTab === "profil" && (
                        <span className="absolute bottom-0 h-1 w-12 bg-white rounded-t-full animate-tab-slide" />
                    )}
                </button>
            </div>
        </nav>
    );
};

export default TabMenu;
