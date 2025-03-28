// src/pages/KelasScreen.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import TabMenu from "../components/TabMenu";
import KelasCard from "../components/KelasCard";

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
    is_register?: boolean; // Tambah properti is_register
}

const KelasScreen = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [filteredKelas, setFilteredKelas] = useState<Kelas[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(5);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchKelas = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                if (!token) {
                    throw new Error(
                        "Token tidak ditemukan. Silakan login ulang."
                    );
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/kelas-saya`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Response API /kelas-saya:", response.data); // Tambah logging
                const kelasData = response.data.data;
                // Pastikan data adalah array
                if (!Array.isArray(kelasData)) {
                    throw new Error("Data kelas tidak valid.");
                }
                setKelasList(kelasData);
                setLoading(false);
            } catch (err) {
                const error = err as AxiosError<{ message: string }>;
                console.error("Error fetching kelas:", error); // Tambah logging
                setError(
                    error.response?.data?.message || "Gagal memuat data kelas."
                );
                setLoading(false);
            }
        };

        fetchKelas();
    }, []);

    useEffect(() => {
        const filtered = kelasList.filter((kelas) =>
            kelas.nama.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredKelas(filtered.slice(0, visibleCount));
    }, [searchQuery, kelasList, visibleCount]);

    useEffect(() => {
        if (loading || error) return;

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

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current && loadMoreRef.current) {
                observerRef.current.unobserve(loadMoreRef.current);
            }
        };
    }, [loading, error, kelasList, visibleCount]);

    const SkeletonCard = () => (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-orange-50">
            <div className="flex-1 p-4 pb-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Kelas Saya
                    </h1>
                    <button
                        onClick={() => navigate("/cari-kelas")}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
                    >
                        Cari Kelas
                    </button>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Cari kelas saya..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        disabled={loading}
                    />
                </div>

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
                                onDaftar={undefined}
                            />
                        ))
                    ) : (
                        <p className="text-gray-600 text-center">
                            Anda belum mendaftar kelas apapun.
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

export default KelasScreen;
