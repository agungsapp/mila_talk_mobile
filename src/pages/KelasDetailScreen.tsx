// src/pages/KelasDetailScreen.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Hapus AxiosError
import TabMenu from "../components/TabMenu";

interface Latihan {
    id: number;
    judul: string;
    deskripsi: string;
    nilai_lulus: number;
    jumlah_soal: number;
    sudah_lulus: boolean; // Gunakan sudah_lulus dari backend
    selesai?: boolean; // Tambahkan selesai sebagai optional, atau hapus jika hanya pakai sudah_lulus
}

interface Dosen {
    id: number;
    name: string;
}

interface Kelas {
    id: number;
    nama: string;
    deskripsi: string;
    dosen: Dosen;
    kuis: Latihan[];
}

const KelasDetailScreen = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [kelas, setKelas] = useState<Kelas | null>(null);
    const [latihanList, setLatihanList] = useState<Latihan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

                console.log("Response API /kelas/:id:", response.data);
                setKelas(response.data);

                // Gunakan sudah_lulus dari response API
                const latihanWithStatus = response.data.kuis
                    ? response.data.kuis.map((latihan: Latihan) => ({
                          ...latihan,
                          selesai: latihan.sudah_lulus, // Tambahkan selesai berdasarkan sudah_lulus
                      }))
                    : [];

                setLatihanList(latihanWithStatus);
                setLoading(false);
            } catch (err) {
                const error = err as unknown; // Ganti AxiosError dengan unknown
                console.error("Error fetching kelas detail:", error);
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

    const totalLatihan = latihanList.length;
    const selesaiCount = latihanList.filter((l) => l.selesai).length;

    return (
        <div className="flex flex-col min-h-screen bg-orange-50">
            <div className="flex-1 p-6 pb-20">
                {loading ? (
                    <div className="text-center text-gray-500 p-4">
                        Loading...
                    </div>
                ) : error ? (
                    <div className="text-center">
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={() => navigate("/kelas")}
                            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
                        >
                            Kembali ke Kelas Saya
                        </button>
                    </div>
                ) : kelas ? (
                    <>
                        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {kelas.nama}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {kelas.deskripsi}
                            </p>
                            <p className="text-gray-500 mt-2 font-medium">
                                <span className="text-gray-700">Dosen:</span>{" "}
                                {kelas.dosen.name}
                            </p>
                        </div>

                        <div className="mb-6 text-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Progress Kuis
                            </h2>
                            <p className="text-gray-600">
                                {selesaiCount} / {totalLatihan} Kuis Selesai
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div
                                    className="bg-orange-500 h-2.5 rounded-full"
                                    style={{
                                        width: `${
                                            totalLatihan > 0
                                                ? (selesaiCount /
                                                      totalLatihan) *
                                                  100
                                                : 0
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {latihanList.length > 0 ? (
                            <div className="grid gap-4">
                                {latihanList.map((latihan, index) => (
                                    <div
                                        key={latihan.id}
                                        className="relative flex items-center p-5 bg-white shadow-md rounded-lg border border-gray-200 cursor-pointer transition duration-200 hover:shadow-lg hover:bg-gray-100"
                                        onClick={() =>
                                            navigate(`/kuis/${latihan.id}`)
                                        }
                                    >
                                        <div
                                            className={`absolute top-0 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center ${
                                                latihan.selesai
                                                    ? "bg-green-500 text-white"
                                                    : "bg-orange-500 text-white"
                                            } left-0 -translate-x-1/2`}
                                        >
                                            {latihan.selesai ? (
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            ) : (
                                                <span className="text-lg font-bold">
                                                    {index + 1}
                                                </span>
                                            )}
                                        </div>

                                        <div className="ml-16">
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {latihan.judul}
                                            </h2>
                                            <p className="text-gray-600">
                                                Deskripsi: {latihan.deskripsi}
                                            </p>
                                            <p className="text-gray-600">
                                                Nilai Minimum:{" "}
                                                {latihan.nilai_lulus}
                                            </p>
                                            <p className="text-gray-600">
                                                Jumlah Soal:{" "}
                                                {latihan.jumlah_soal}
                                            </p>
                                            <span
                                                className={`text-sm font-medium ${
                                                    latihan.selesai
                                                        ? "text-green-600"
                                                        : "text-orange-600"
                                                }`}
                                            >
                                                {latihan.selesai
                                                    ? "Selesai"
                                                    : "Belum Selesai"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center">
                                Kelas ini belum memiliki kuis apapun untuk
                                dikerjakan.
                            </p>
                        )}
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-600">Kelas tidak ditemukan.</p>
                        <button
                            onClick={() => navigate("/kelas")}
                            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
                        >
                            Kembali ke Kelas Saya
                        </button>
                    </div>
                )}
            </div>
            <TabMenu activeTab="kelas" />
        </div>
    );
};

export default KelasDetailScreen;
