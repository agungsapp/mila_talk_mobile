// src/pages/CariKelasScreen.tsx
import { useState, useEffect, useRef } from "react";
import axios from "axios"; // Hapus AxiosError karena tidak ditemukan
import TabMenu from "../components/TabMenu";
import KelasCard from "../components/KelasCard";
import Super from "../assets/super.png";
import Halo from "../assets/actor/dashboard.png";

// Tipe untuk data kelas sesuai response API
interface Dosen {
    id: number;
    nama: string;
}

interface Kelas {
    id: number;
    nama: string;
    deskripsi: string;
    dosen: Dosen;
    is_register: boolean;
}

// Tipe untuk response API (karena ada properti "data" di dalamnya)
interface KelasResponse {
    data: Kelas[];
}

const CariKelasScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [filteredKelas, setFilteredKelas] = useState<Kelas[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(5);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Fetch data semua kelas dari API
    useEffect(() => {
        const fetchKelas = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                if (!token) {
                    throw new Error(
                        "Token tidak ditemukan. Silakan login ulang."
                    );
                }

                const response = await axios.get<KelasResponse>(
                    `${import.meta.env.VITE_API_BASE_URL}/kelas`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setKelasList(response.data.data); // Tipe aman karena KelasResponse
                setLoading(false);
            } catch (err) {
                const error = err as unknown; // Ganti AxiosError dengan unknown
                setError(
                    error instanceof Error
                        ? error.message
                        : "Gagal memuat data kelas."
                );
                setLoading(false);
            }
        };

        fetchKelas();
    }, []);

    // Filter dan batasi kelas yang dirender berdasarkan pencarian dan visibleCount
    useEffect(() => {
        const filtered = kelasList.filter((kelas) =>
            kelas.nama.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredKelas(filtered.slice(0, visibleCount));
    }, [searchQuery, kelasList, visibleCount]);

    // Infinite scroll observer
    useEffect(() => {
        if (loading || error) return;

        const currentLoadMoreRef = loadMoreRef.current; // Simpan ref ke variabel lokal
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    visibleCount < kelasList.length
                ) {
                    setVisibleCount((prev) => prev + 5);
                }
            },
            { threshold: 0.1 }
        );

        if (currentLoadMoreRef) {
            observerRef.current.observe(currentLoadMoreRef);
        }

        return () => {
            if (observerRef.current && currentLoadMoreRef) {
                observerRef.current.unobserve(currentLoadMoreRef);
            }
        };
    }, [loading, error, kelasList, visibleCount]);

    const handleDaftar = async (kelasId: number): Promise<boolean> => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                throw new Error("Token tidak ditemukan. Silakan login ulang.");
            }

            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/kelas/${kelasId}/daftar`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Refresh daftar kelas setelah berhasil daftar
            const response = await axios.get<KelasResponse>(
                `${import.meta.env.VITE_API_BASE_URL}/kelas`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setKelasList(response.data.data); // Tipe aman
            return true;
        } catch (err) {
            console.error("Error saat mendaftar kelas:", err);
            return false;
        }
    };

    // Skeleton component
    const SkeletonCard = () => (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded-full mt-2"></div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-orange-50">
            {/* header */}
            <div className="w-full pb-10 bg-gradient-to-br from-orange-500 via-pink-700 to-blue-900 p-4">
                <h1 className="text-2xl font-bold text-white"> Cari Kelas</h1>
                <div className="mt-3 p-4 rounded-2xl backdrop-blur-md bg-white/20 border relative border-white/10">
                    <img
                        src={Super}
                        alt="super image"
                        className="absolute -top-3 right-3 w-20 animate-shake-left-right"
                    />
                    <p className="text-white font-bold capitalize transition duration-300 hover:text-yellow-400">
                        Mulai belajarmu
                    </p>
                    <p className="text-white transition duration-300 hover:text-pink-400">
                        cari kelas menarik untukmu sekarang di sini
                    </p>
                    <div className="flex justify-end items-end">
                        <img src={Halo} alt="halo icon" className="h-32 " />
                    </div>
                </div>
            </div>

            <div className="flex-1 -mt-5 rounded-t-xl bg-orange-50 p-4 pb-20">
                {/* Header */}
                {/* <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Cari Kelas
                </h1> */}

                {/* Box Pencarian */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Cari kelas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        disabled={loading}
                    />
                </div>

                {/* Daftar Kelas */}
                <div className="space-y-4">
                    {loading ? (
                        Array(5)
                            .fill(0)
                            .map((_, index) => <SkeletonCard key={index} />)
                    ) : error ? (
                        <p className="text-red-500 text-center">{error}</p>
                    ) : filteredKelas.length > 0 ? (
                        filteredKelas.map((kelas) => (
                            <KelasCard
                                key={kelas.id}
                                kelas={kelas}
                                onDaftar={handleDaftar}
                            />
                        ))
                    ) : (
                        <p className="text-gray-600 text-center">
                            Kelas tidak ditemukan.
                        </p>
                    )}
                    {!loading &&
                        !error &&
                        filteredKelas.length < kelasList.length && (
                            <div ref={loadMoreRef} className="h-10" />
                        )}
                </div>
            </div>
            <TabMenu activeTab="kelas" />
        </div>
    );
};

export default CariKelasScreen;
