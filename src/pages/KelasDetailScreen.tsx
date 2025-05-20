import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TabMenu from "../components/TabMenu";

// Icons (you can use an icon library like react-icons for this)
import { FaStar, FaBook, FaHeadphones } from "react-icons/fa";

interface Latihan {
    id: number;
    judul: string;
    deskripsi: string;
    nilai_lulus: number;
    jumlah_soal: number;
    sudah_lulus: boolean;
    selesai?: boolean;
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

                const latihanWithStatus = response.data.kuis
                    ? response.data.kuis.map((latihan: Latihan) => ({
                          ...latihan,
                          selesai: latihan.sudah_lulus,
                      }))
                    : [];

                setLatihanList(latihanWithStatus);
                setLoading(false);
            } catch (err) {
                const error = err as unknown;
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

    // Function to determine the icon for each latihan
    const getIconForLatihan = (index: number) => {
        const icons = [<FaStar />, <FaBook />, <FaHeadphones />];
        return icons[index % icons.length];
    };

    return (
        <div className="flex flex-col min-h-screen bg-orange-50">
            <div className="flex-1  pb-20">
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
                        <div className="p-6  bg-gradient-to-br from-orange-500 via-pink-700 to-blue-900 shadow-lg   mb-6">
                            <h1 className="text-2xl font-bold capitalize text-white">
                                {kelas.nama}
                            </h1>
                            <p className="text-white mt-2">{kelas.deskripsi}</p>
                            <p className="text-white mt-2 font-medium">
                                <span className="text-white">Dosen:</span>{" "}
                                {kelas.dosen.name}
                            </p>
                        </div>

                        {/* Progress Section with Circular Route */}
                        <div className="mb-6 rounded-t-xl pt-10 bg-orange-50 -mt-8 relative">
                            <h2 className="text-xl font-semibold text-gray-800 text-center">
                                Progress Kuis
                            </h2>
                            <p className="text-gray-600 text-center mb-8">
                                {selesaiCount} / {totalLatihan} Kuis Selesai
                            </p>

                            {/* Circular Route Container */}
                            <div className="relative flex flex-col items-center h-[400px]">
                                {latihanList.length > 0 ? (
                                    <>
                                        {/* SVG Path for Connecting Line */}
                                        <svg
                                            className="absolute inset-0 w-full h-full"
                                            style={{ zIndex: 0 }}
                                        >
                                            <path
                                                d={latihanList
                                                    .map((_, index) => {
                                                        const x =
                                                            index % 2 === 0
                                                                ? 150
                                                                : 250; // Centered for the circles
                                                        const y =
                                                            index * 100 + 48; // Adjusted to center the line
                                                        return index === 0
                                                            ? `M ${x} ${y}`
                                                            : ` L ${x} ${y}`;
                                                    })
                                                    .join("")}
                                                fill="none"
                                                stroke="#D1D5DB"
                                                strokeWidth="4"
                                                strokeDasharray="8 8"
                                            />
                                        </svg>

                                        {/* Circular Buttons */}
                                        {latihanList.map((latihan, index) => (
                                            <div
                                                key={latihan.id}
                                                className={`absolute flex items-center justify-center w-16 h-16 rounded-full ${
                                                    latihan.selesai
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-400 text-white"
                                                } transition duration-200 hover:shadow-lg cursor-pointer z-10 shadow-md`}
                                                style={{
                                                    top: `${index * 100}px`,
                                                    left:
                                                        index % 2 === 0
                                                            ? "40%"
                                                            : "60%",
                                                    transform:
                                                        "translateX(-50%)",
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/kuis/${latihan.id}`
                                                    )
                                                }
                                            >
                                                <span className="text-3xl">
                                                    {getIconForLatihan(index)}
                                                </span>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <p className="text-gray-600 text-center">
                                        Belum ada kuis untuk ditampilkan.
                                    </p>
                                )}

                                {/* Decorative Placeholders (Left and Right) */}
                                <div
                                    className="absolute top-0 left-0 w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center"
                                    style={{ transform: "translateX(-50%)" }}
                                >
                                    <span className="text-4xl">🌸</span>
                                </div>
                                <div
                                    className="absolute bottom-0 right-0 w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center"
                                    style={{ transform: "translateX(50%)" }}
                                >
                                    <span className="text-4xl">🎉</span>
                                </div>
                            </div>
                        </div>
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
