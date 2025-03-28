import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TabMenu from "../components/TabMenu";
import MediaSoal from "../components/MediaSoal";

interface Soal {
    id: number;
    tipe: string;
    konten: {
        pertanyaan: string;
        opsi?: { [key: string]: string };
        image_path?: string;
        audio_path?: string;
        pasangan?: { kiri: string; kanan: string }[];
    };
    jawaban_benar: string;
}

interface Kuis {
    id: number;
    judul: string;
    deskripsi: string;
    nilai_lulus: number;
    jumlah_soal: number;
    soal: Soal[];
}

interface KuisDetailData {
    kuis: Kuis;
    soal: Soal;
    nomor: number;
    total_soal: number;
}

const KuisDetailScreen = () => {
    const { id: kuisId, soalIndex } = useParams<{
        id: string;
        soalIndex: string;
    }>();
    const [data, setData] = useState<KuisDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSoalIndex, setCurrentSoalIndex] = useState<number>(
        soalIndex && !isNaN(parseInt(soalIndex)) ? parseInt(soalIndex) - 1 : 0
    );
    const [jawabanSiswa, setJawabanSiswa] = useState<{ [key: number]: string }>(
        {}
    );
    const [selesai, setSelesai] = useState(false);
    const [skor, setSkor] = useState<number | null>(null);

    useEffect(() => {
        const fetchKuisDetail = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                if (!token) throw new Error("Token tidak ditemukan");

                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/kuis/${kuisId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const kuisData: Kuis = response.data;
                const nomorSoal = currentSoalIndex + 1;
                const soal = kuisData.soal[currentSoalIndex];

                setData({
                    kuis: kuisData,
                    soal: soal,
                    nomor: nomorSoal,
                    total_soal: kuisData.soal.length,
                });
            } catch (error) {
                setError("Gagal mengambil data kuis.");
                console.error("Gagal mengambil data kuis:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchKuisDetail();
    }, [kuisId, currentSoalIndex]);

    const handleCocokKataChange = (kiri: string, kanan: string) => {
        if (!data?.soal) return;

        let currentJawaban: { kiri: string; kanan: string }[] = [];
        if (jawabanSiswa[data.soal.id]) {
            currentJawaban = JSON.parse(jawabanSiswa[data.soal.id]);
        }

        const updatedJawaban = currentJawaban.filter(
            (pair) => pair.kiri !== kiri
        );
        updatedJawaban.push({ kiri, kanan });

        setJawabanSiswa((prev) => ({
            ...prev,
            [data.soal.id]: JSON.stringify(updatedJawaban),
        }));
    };

    const handleJawabanChange = (soalId: number, jawaban: string) => {
        setJawabanSiswa((prev) => ({
            ...prev,
            [soalId]: jawaban,
        }));
    };

    const handleNext = async () => {
        if (!data?.soal || !jawabanSiswa[data.soal.id]) {
            alert("Silakan pilih jawaban terlebih dahulu!");
            return;
        }

        if (data.soal.tipe === "cocok_kata" && data.soal.konten.pasangan) {
            const allPairsSelected = data.soal.konten.pasangan.every(
                (pair) =>
                    jawabanSiswa[data.soal.id] &&
                    JSON.parse(jawabanSiswa[data.soal.id]).some(
                        (p: { kiri: string }) => p.kiri === pair.kiri
                    )
            );
            if (!allPairsSelected) {
                alert("Silakan cocokkan semua kata terlebih dahulu!");
                return;
            }
        }

        if (currentSoalIndex === (data?.kuis.soal.length ?? 0) - 1) {
            try {
                const promises = Object.entries(jawabanSiswa).map(
                    ([soalId, jawaban]) =>
                        axios.post(
                            `${
                                import.meta.env.VITE_API_BASE_URL
                            }/soal/${soalId}/jawab`,
                            { jawaban },
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem(
                                        "auth_token"
                                    )}`,
                                },
                            }
                        )
                );

                await Promise.all(promises);

                let correctCount = 0;
                data?.kuis.soal.forEach((soal) => {
                    if (soal.tipe === "cocok_kata") {
                        const jawabanBenar = JSON.parse(soal.jawaban_benar);
                        const jawabanUser = jawabanSiswa[soal.id]
                            ? JSON.parse(jawabanSiswa[soal.id])
                            : [];
                        const isCorrect = jawabanBenar.every(
                            (
                                pair: { kiri: string; kanan: string },
                                index: number
                            ) =>
                                jawabanUser[index] &&
                                pair.kiri === jawabanUser[index].kiri &&
                                pair.kanan === jawabanUser[index].kanan
                        );
                        if (isCorrect) correctCount++;
                    } else {
                        if (jawabanSiswa[soal.id] === soal.jawaban_benar) {
                            correctCount++;
                        }
                    }
                });
                const totalSoal = data?.kuis.soal.length ?? 1;
                const skorAkhir = (correctCount / totalSoal) * 100;
                setSkor(skorAkhir);
                setSelesai(true);
            } catch (error) {
                console.error("Gagal submit jawaban:", error);
                alert("Gagal submit jawaban. Silakan coba lagi.");
            }
        } else {
            setCurrentSoalIndex((prev) => prev + 1);
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
                <div className="flex-1 p-6 pb-20">
                    <p className="text-red-500 text-center">{error}</p>
                </div>
                <TabMenu activeTab="kelas" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col min-h-screen bg-orange-50">
                <div className="flex-1 p-6 pb-20">
                    <p className="text-gray-600 text-center">
                        Kuis tidak ditemukan.
                    </p>
                </div>
                <TabMenu activeTab="kelas" />
            </div>
        );
    }

    if (selesai) {
        return (
            <div className="flex flex-col min-h-screen bg-orange-50">
                <div className="flex-1 p-6 pb-20">
                    <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 mb-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Kuis Selesai!
                        </h1>
                        <p className="text-gray-600 mb-2">
                            Skor Anda: {skor?.toFixed(2)} / 100
                        </p>
                        <p className="text-gray-600">
                            {skor && skor >= data.kuis.nilai_lulus
                                ? "Selamat, Anda lulus!"
                                : "Maaf, Anda belum lulus. Coba lagi!"}
                        </p>
                    </div>
                </div>
                <TabMenu activeTab="kelas" />
            </div>
        );
    }

    const { kuis, soal, nomor, total_soal } = data;

    return (
        <div className="flex flex-col min-h-screen bg-orange-50">
            <div className="flex-1 p-6 pb-20">
                <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {kuis.judul}
                    </h1>
                    <p className="text-gray-600 mt-2">{kuis.deskripsi}</p>
                    <p className="text-gray-600 mt-2">
                        Nilai Minimum: {kuis.nilai_lulus}
                    </p>
                    <p className="text-gray-600 mt-2">
                        Soal {nomor} dari {total_soal}
                    </p>
                </div>

                {soal ? (
                    <div className="p-5 bg-white shadow-md rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {soal.konten.pertanyaan}
                        </h2>

                        {/* Tipe Soal: Tebak Gambar */}
                        {soal.tipe === "tebak_gambar" &&
                            soal.konten.image_path &&
                            soal.konten.opsi && (
                                <MediaSoal
                                    tipe="tebak_gambar"
                                    mediaUrl={soal.konten.image_path}
                                    opsi={soal.konten.opsi}
                                    soalId={soal.id}
                                    selectedJawaban={jawabanSiswa[soal.id]}
                                    onJawabanChange={handleJawabanChange}
                                />
                            )}

                        {/* Tipe Soal: Mendengarkan */}
                        {soal.tipe === "mendengarkan" &&
                            soal.konten.audio_path &&
                            soal.konten.opsi && (
                                <MediaSoal
                                    tipe="mendengarkan"
                                    mediaUrl={soal.konten.audio_path}
                                    opsi={soal.konten.opsi}
                                    soalId={soal.id}
                                    selectedJawaban={jawabanSiswa[soal.id]}
                                    onJawabanChange={handleJawabanChange}
                                />
                            )}

                        {/* Tipe Soal: Normal */}
                        {soal.tipe === "normal" && soal.konten.opsi && (
                            <>
                                {Object.entries(soal.konten.opsi).map(
                                    ([key, value]) => (
                                        <div key={key} className="mb-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`soal-${soal.id}`}
                                                    value={key}
                                                    checked={
                                                        jawabanSiswa[
                                                            soal.id
                                                        ] === key
                                                    }
                                                    onChange={() =>
                                                        handleJawabanChange(
                                                            soal.id,
                                                            key
                                                        )
                                                    }
                                                    className="mr-2"
                                                />
                                                <span className="text-gray-700">
                                                    {key}. {value}
                                                </span>
                                            </label>
                                        </div>
                                    )
                                )}
                            </>
                        )}

                        {/* Tipe Soal: Cocok Kata */}
                        {soal.tipe === "cocok_kata" && soal.konten.pasangan && (
                            <div className="mb-4">
                                {soal.konten.pasangan.map((pair, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between mb-2"
                                    >
                                        <span className="text-gray-700">
                                            {pair.kiri}
                                        </span>
                                        <select
                                            value={
                                                jawabanSiswa[soal.id]
                                                    ? JSON.parse(
                                                          jawabanSiswa[soal.id]
                                                      ).find(
                                                          (p: {
                                                              kiri: string;
                                                          }) =>
                                                              p.kiri ===
                                                              pair.kiri
                                                      )?.kanan || ""
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                handleCocokKataChange(
                                                    pair.kiri,
                                                    e.target.value
                                                )
                                            }
                                            className="border border-gray-300 rounded-lg p-2"
                                        >
                                            <option value="" disabled>
                                                Pilih pasangan
                                            </option>
                                            {soal.konten.pasangan.map(
                                                (opt, optIndex) => (
                                                    <option
                                                        key={optIndex}
                                                        value={opt.kanan}
                                                    >
                                                        {opt.kanan}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleNext}
                            className="mt-4 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
                        >
                            {currentSoalIndex === kuis.soal.length - 1
                                ? "Selesai"
                                : "Selanjutnya"}
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center">
                        Kuis ini belum memiliki soal apapun untuk dikerjakan.
                    </p>
                )}
            </div>
            <TabMenu activeTab="kelas" />
        </div>
    );
};

export default KuisDetailScreen;
