// src/pages/KuisOverviewScreen.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Hapus AxiosError
import TabMenu from "../components/TabMenu";

interface Kuis {
    id: number;
    judul: string;
    deskripsi: string;
    nilai_lulus: number;
    jumlah_soal: number;
}

interface RiwayatPengerjaan {
    attempt_id: string;
    kuis_id: number;
    user_id: number;
    nilai: number;
    lulus: boolean;
    created_at: string;
}

interface KuisResponse {
    id: number;
    judul: string;
    deskripsi: string;
    nilai_lulus: number;
    jumlah_soal: number;
}

// Tipe untuk respons riwayat
interface RiwayatResponse {
    data: RiwayatPengerjaan[];
    sudah_lulus: boolean;
}

const KuisOverviewScreen = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [kuis, setKuis] = useState<Kuis | null>(null);
    const [riwayat, setRiwayat] = useState<RiwayatPengerjaan[]>([]);
    const [sudahLulus, setSudahLulus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKuisDetail = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                if (!token) {
                    throw new Error(
                        "Token tidak ditemukan. Silakan login ulang."
                    );
                }

                // Ambil data kuis
                const kuisResponse = await axios.get<KuisResponse>(
                    `${import.meta.env.VITE_API_BASE_URL}/kuis/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Response API /kuis/:id:", kuisResponse.data);
                setKuis(kuisResponse.data);

                // Ambil riwayat pengerjaan dengan tipe generik
                const riwayatResponse = await axios.get<RiwayatResponse>(
                    `${import.meta.env.VITE_API_BASE_URL}/kuis/${id}/riwayat`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log(
                    "Response API /kuis/:id/riwayat:",
                    riwayatResponse.data
                );
                setRiwayat(riwayatResponse.data.data); // Tipe aman
                setSudahLulus(riwayatResponse.data.sudah_lulus); // Tipe aman
                setLoading(false);
            } catch (err) {
                const error = err as unknown; // Ganti AxiosError dengan unknown
                console.error("Error fetching kuis overview:", error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Gagal memuat data kuis."
                );
                setLoading(false);
            }
        };

        fetchKuisDetail();
    }, [id]);

    const handleMulaiKuis = () => {
        navigate(`/kuis/${id}/soal/1`);
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
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
                    >
                        Kembali
                    </button>
                </div>
                <TabMenu activeTab="kelas" />
            </div>
        );
    }

    if (!kuis) {
        return (
            <div className="flex flex-col min-h-screen bg-orange-50">
                <div className="flex-1 p-6 pb-20 text-center">
                    <p className="text-gray-600">Kuis tidak ditemukan.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
                    >
                        Kembali
                    </button>
                </div>
                <TabMenu activeTab="kelas" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-orange-50">
            <div className="flex-1 p-6 pb-20">
                {/* Informasi Kuis */}
                <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {kuis.judul}
                    </h1>
                    <p className="text-gray-600 mt-2">{kuis.deskripsi}</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Nilai Minimum: {kuis.nilai_lulus}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Jumlah Soal: {kuis.jumlah_soal}
                    </p>
                    <button
                        onClick={handleMulaiKuis}
                        disabled={sudahLulus}
                        className={`mt-4 w-full py-2 rounded-lg transition duration-200 ${
                            sudahLulus
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}
                        title={
                            sudahLulus
                                ? "Anda sudah lulus kuis ini"
                                : "Mulai mengerjakan kuis"
                        }
                    >
                        {sudahLulus ? "Sudah Lulus" : "Mulai Mengerjakan Kuis"}
                    </button>
                </div>

                {/* Riwayat Pengerjaan */}
                <div className="p-5 bg-white shadow-md rounded-lg border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Riwayat Pengerjaan
                    </h2>
                    {riwayat.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-700">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 text-sm font-semibold">
                                            Tanggal
                                        </th>
                                        <th className="p-3 text-sm font-semibold">
                                            Nilai
                                        </th>
                                        <th className="p-3 text-sm font-semibold">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riwayat.map((item) => (
                                        <tr
                                            key={item.attempt_id}
                                            className="border-b"
                                        >
                                            <td className="p-3 text-sm">
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleString()}
                                            </td>
                                            <td className="p-3 text-sm">
                                                {item.nilai}
                                            </td>
                                            <td className="p-3 text-sm">
                                                <span
                                                    className={`${
                                                        item.lulus
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    } font-medium`}
                                                >
                                                    {item.lulus
                                                        ? "Lulus"
                                                        : "Tidak Lulus"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">
                            Belum ada riwayat pengerjaan untuk kuis ini.
                        </p>
                    )}
                </div>
            </div>
            <TabMenu activeTab="kelas" />
        </div>
    );
};

export default KuisOverviewScreen;
