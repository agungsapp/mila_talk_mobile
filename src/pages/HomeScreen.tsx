// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, getAuthToken } from "../utils/api";
import TabMenu from "../components/TabMenu";

interface ProfileData {
    name: string;
    email: string;
    image: string;
    created_at: string;
    status: string;
    points: number;
}

interface KuisBelumLulus {
    id: number;
    judul: string;
    nama_kelas: string;
    nilai: number;
    nilai_lulus: number;
}

interface ProgresResponse {
    total_kuis_selesai: number;
    total_kuis: number; // Tambah field ini untuk total semua kuis
    rata_rata_nilai: number;
    kuis_selesai: KuisBelumLulus[];
}

const HomeScreen: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [progres, setProgres] = useState<ProgresResponse | null>(null);
    const [kuisBelumLulus, setKuisBelumLulus] = useState<KuisBelumLulus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getAuthToken();

                // Ambil data profil
                const profileResponse = await apiClient.get("/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(profileResponse.data);

                // Ambil data progres kuis
                const progresResponse = await apiClient.get("/kuis-progres", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProgres(progresResponse.data);

                // Ambil data kuis yang belum lulus
                const kuisBelumLulusResponse = await apiClient.get(
                    "/kuis-belum-lulus",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setKuisBelumLulus(kuisBelumLulusResponse.data);

                setLoading(false);
            } catch (err: any) {
                setError(err.message || "Gagal memuat data");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Memuat...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error}
            </div>
        );
    }

    // Hitung persentase progres kuis selesai
    const totalKuis = progres?.total_kuis || 10; // Default 10 jika total_kuis tidak ada
    const kuisSelesai = progres?.total_kuis_selesai || 0;
    const progressPercentage =
        totalKuis > 0 ? (kuisSelesai / totalKuis) * 100 : 0;

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 p-4 pb-20 max-w-md mx-auto">
                {/* Header Selamat Datang */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Selamat Datang, {profile?.name}!
                </h1>
                <p className="text-gray-600 mb-6">
                    Terus belajar dan raih prestasi terbaikmu di MilaTalk!
                </p>

                {/* Ringkasan Progres dengan Progress Bar */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">
                        Progres Belajar
                    </h2>
                    <div className="mb-4">
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Kuis Selesai</span>
                            <span className="text-gray-800">
                                {kuisSelesai} dari {totalKuis}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-orange-500 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Rata-rata Nilai</span>
                        <span className="text-gray-800">
                            {progres?.rata_rata_nilai}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Poin</span>
                        <span className="text-orange-500 font-semibold">
                            {profile?.points}
                        </span>
                    </div>
                </div>

                {/* Ajakan untuk Menyelesaikan Kuis Belum Lulus */}
                {kuisBelumLulus.length > 0 && (
                    <div className="bg-orange-100 p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-md font-semibold text-gray-800">
                                Yuk selesaikan {kuisBelumLulus.length} kuis kamu
                                yang belum lulus!
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Tingkatkan nilai dan raih poin lebih banyak.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/kuis/belum-lulus")}
                            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
                        >
                            Kerjakan Sekarang
                        </button>
                    </div>
                )}

                {/* Akses Cepat */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={() => navigate("/kelas")}
                        className="bg-orange-500 text-white p-4 rounded-lg shadow-md hover:bg-orange-600 transition duration-300 flex flex-col items-center"
                    >
                        <svg
                            className="w-8 h-8 mb-2"
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
                        <span className="text-sm font-medium">Lihat Kelas</span>
                    </button>
                    <button
                        onClick={() => navigate("/kuis")}
                        className="bg-orange-500 text-white p-4 rounded-lg shadow-md hover:bg-orange-600 transition duration-300 flex flex-col items-center"
                    >
                        <svg
                            className="w-8 h-8 mb-2"
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
                        <span className="text-sm font-medium">Ikuti Kuis</span>
                    </button>
                </div>
            </div>
            <TabMenu activeTab="home" />
        </div>
    );
};

export default HomeScreen;
