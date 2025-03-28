// src/pages/PreviewKelasScreen.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Hapus AxiosError
import TabMenu from "../components/TabMenu";

// Tipe untuk data kelas dan kuis
interface Dosen {
    id: number;
    name: string; // Ubah dari nama ke name sesuai response API
}

interface Kuis {
    id: number;
    judul: string;
    deskripsi: string;
    nilai_lulus: number;
    jumlah_soal: number;
}

interface Kelas {
    id: number;
    nama: string;
    deskripsi: string;
    dosen: Dosen;
    kuis: Kuis[];
}

const PreviewKelasScreen = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [kelas, setKelas] = useState<Kelas | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data kelas dan kuis dari API
    useEffect(() => {
        const fetchKelasDetail = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                if (!token) {
                    throw new Error(
                        "Token tidak ditemukan. Silakan login ulang."
                    );
                }

                const response = await axios.get<Kelas>(
                    `${import.meta.env.VITE_API_BASE_URL}/kelas/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log(
                    "Response API /kelas/:id (Preview):",
                    response.data
                );

                setKelas(response.data); // Tipe aman karena Kelas
                console.log("Set kelas:", response.data); // Tambah log untuk memastikan setKelas
                setLoading(false);
            } catch (err) {
                const error = err as unknown; // Ganti AxiosError dengan unknown
                console.error("Error fetching kelas preview:", error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Gagal memuat data kelas."
                );
                setLoading(false);
            }
        };

        fetchKelasDetail();
    }, [id]);

    // Fungsi untuk mendaftar ke kelas
    const handleDaftar = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                throw new Error("Token tidak ditemukan. Silakan login ulang.");
            }

            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/kelas/${id}/daftar`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Berhasil mendaftar kelas!");
            navigate(`/kelas/${id}`);
        } catch (err) {
            const error = err as unknown; // Ganti AxiosError dengan unknown
            console.error("Error saat mendaftar kelas:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Gagal mendaftar kelas. Silakan coba lagi."
            );
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-orange-50">
                <div className="flex-1 p-6 pb-20">
                    <div className="text-center text-gray-500 p-4">
                        Loading...
                    </div>
                </div>
                <TabMenu activeTab="kelas" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-orange-50">
                <div className="flex-1 p-6 pb-20 text-center">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={() => navigate("/cari-kelas")}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
                    >
                        Kembali ke Cari Kelas
                    </button>
                </div>
                <TabMenu activeTab="kelas" />
            </div>
        );
    }

    if (!kelas) {
        return (
            <div className="flex flex-col min-h-screen bg-orange-50">
                <div className="flex-1 p-6 pb-20 text-center">
                    <p className="text-gray-600">Kelas tidak ditemukan.</p>
                    <button
                        onClick={() => navigate("/cari-kelas")}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
                    >
                        Kembali ke Cari Kelas
                    </button>
                </div>
                <TabMenu activeTab="kelas" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-orange-50">
            <div className="flex-1 p-6 pb-20">
                {/* Informasi Kelas */}
                <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {kelas.nama}
                        <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Belum Terdaftar
                        </span>
                    </h1>
                    <p className="text-gray-600 mt-2">{kelas.deskripsi}</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Dosen: {kelas.dosen.name} {/* Ubah dari nama ke name */}
                    </p>
                    <button
                        onClick={handleDaftar}
                        className="mt-4 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
                    >
                        Daftar Kelas
                    </button>
                </div>

                {/* Daftar Kuis (Hanya Judul, Tidak Bisa Diklik) */}
                <div className="p-5 bg-white shadow-md rounded-lg border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Daftar Kuis
                    </h2>
                    {kelas.kuis && kelas.kuis.length > 0 ? (
                        <ul className="space-y-3">
                            {kelas.kuis.map((kuis) => (
                                <li
                                    key={kuis.id}
                                    className="p-3 bg-gray-100 rounded-lg text-gray-700"
                                >
                                    <p className="font-semibold">
                                        {kuis.judul}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {kuis.deskripsi}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 text-center">
                            Belum ada kuis di kelas ini.
                        </p>
                    )}
                    <p className="text-gray-600 text-center mt-4">
                        Daftar ke kelas ini untuk mengakses kuis.
                    </p>
                </div>
            </div>
            <TabMenu activeTab="kelas" />
        </div>
    );
};

export default PreviewKelasScreen;
