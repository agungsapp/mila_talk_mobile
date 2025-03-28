// src/screens/KuisBelumLulusScreen.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, getAuthToken } from "../utils/api";
import TabMenu from "../components/TabMenu";

interface KuisBelumLulus {
    id: number;
    judul: string;
    nama_kelas: string;
    nilai: number;
    nilai_lulus: number;
}

const KuisBelumLulusScreen: React.FC = () => {
    const navigate = useNavigate();
    const [kuisBelumLulus, setKuisBelumLulus] = useState<KuisBelumLulus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKuisBelumLulus = async () => {
            try {
                const token = getAuthToken();
                const response = await apiClient.get("/kuis-belum-lulus", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setKuisBelumLulus(response.data);
                setLoading(false);
            } catch (error: any) {
                setError(
                    error.message || "Gagal memuat data kuis yang belum lulus"
                );
                setLoading(false);
            }
        };

        fetchKuisBelumLulus();
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
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Kuis yang Belum Lulus</h1>
                <button
                    onClick={() => navigate("/kuis")}
                    className="bg-gray-500 text-white py-1 px-3 rounded-lg hover:bg-gray-600"
                >
                    Kembali
                </button>
            </div>

            {/* Daftar Kuis Belum Lulus */}
            <div>
                {kuisBelumLulus.length === 0 ? (
                    <p className="text-gray-500">
                        Tidak ada kuis yang belum lulus.
                    </p>
                ) : (
                    kuisBelumLulus.map((kuis) => (
                        <div
                            key={kuis.id}
                            className="bg-white p-4 rounded-lg shadow-md mb-2 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="text-md font-semibold">
                                    {kuis.judul}
                                </h3>
                                <p className="text-gray-600">
                                    {kuis.nama_kelas}
                                </p>
                                <p className="text-gray-600">
                                    Nilai: {kuis.nilai} | Nilai Lulus:{" "}
                                    {kuis.nilai_lulus}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(`/kuis/${kuis.id}`)}
                                className="bg-orange-500 text-white py-1 px-3 rounded-lg hover:bg-orange-600"
                            >
                                Kerjakan Ulang
                            </button>
                        </div>
                    ))
                )}
            </div>
            <TabMenu activeTab="kuis" />
        </div>
    );
};

export default KuisBelumLulusScreen;
