// src/screens/KuisScreen.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, getAuthToken } from "../utils/api";
import TabMenu from "../components/TabMenu";
import Confuse from "../assets/actor/confuse.png";

interface KuisSelesai {
    id: number;
    judul: string;
    nama_kelas: string;
    nilai: number;
    nilai_lulus: number;
}

interface ProgresResponse {
    total_kuis_selesai: number;
    rata_rata_nilai: number;
    kuis_selesai: KuisSelesai[];
}

const KuisScreen: React.FC = () => {
    const navigate = useNavigate();
    const [progres, setProgres] = useState<ProgresResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgres = async () => {
            try {
                const token = getAuthToken();
                const response = await apiClient.get<ProgresResponse>(
                    "/kuis-progres",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setProgres(response.data); // Tipe aman karena ProgresResponse
                setLoading(false);
            } catch (err) {
                const error = err as unknown; // Ganti any dengan unknown
                setError(
                    error instanceof Error
                        ? error.message
                        : "Gagal memuat data progres kuis"
                );
                setLoading(false);
            }
        };

        fetchProgres();
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

    return (
        <div className="bg-orange-50 p-4">
            {/* Header: Statistik */}
            <div className="bg-white p-4 rounded-2xl shadow-md mb-4">
                <h1 className="text-xl font-bold mb-2">Progres Kuis</h1>
                <div className="flex justify-between">
                    <p>Kuis Selesai: {progres?.total_kuis_selesai}</p>
                    <p>Rata-rata Nilai: {progres?.rata_rata_nilai}</p>
                </div>
            </div>

            {/* Tombol: Lihat Kuis yang Belum Lulus */}
            <button
                onClick={() => navigate("/kuis/belum-lulus")}
                className="w-full bg-orange-500 text-white py-2 rounded-2xl mb-4 hover:bg-orange-600"
            >
                Lihat Kuis yang Belum Lulus
            </button>

            {/* Daftar Kuis Selesai */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Kuis Selesai</h2>
                {progres?.kuis_selesai.length === 0 ? (
                    <div className="mx-auto flex justify-center items-center flex-col py-12">
                        <img src={Confuse} className="w-1/2" alt="confused" />
                        <p className="text-gray-700 text-center">
                            Belum ada kuis yang selesai.
                        </p>
                    </div>
                ) : (
                    progres?.kuis_selesai.map((kuis) => (
                        <div
                            key={kuis.id}
                            className="bg-white p-4 rounded-2xl shadow-md mb-2"
                        >
                            <h3 className="text-md font-semibold">
                                {kuis.judul}
                            </h3>
                            <p className="text-gray-600">{kuis.nama_kelas}</p>
                            <p className="text-gray-600">
                                Nilai: {kuis.nilai} | Nilai Lulus:{" "}
                                {kuis.nilai_lulus}
                            </p>
                        </div>
                    ))
                )}
            </div>
            <TabMenu activeTab="kuis" />
        </div>
    );
};

export default KuisScreen;
