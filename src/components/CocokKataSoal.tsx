// src/components/CocokKataSoal.tsx
import React, { useState, useEffect } from "react";

interface Pasangan {
    kiri: string;
    kanan: string;
}

interface CocokKataSoalProps {
    pasangan: Pasangan[];
    jawabanBenar: string; // String JSON dari jawaban_benar
    onNextSoal: () => void; // Callback untuk lanjut ke soal berikutnya
    onJawabanChange: (jawaban: string) => void; // Callback untuk simpan jawaban
}

const CocokKataSoal: React.FC<CocokKataSoalProps> = ({
    pasangan,
    jawabanBenar,
    onNextSoal,
    onJawabanChange,
}) => {
    const [selectedKiri, setSelectedKiri] = useState<string | null>(null);
    const [selectedKanan, setSelectedKanan] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Pasangan[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Parse jawaban_benar ke array
    const jawabanBenarArray: Pasangan[] = JSON.parse(jawabanBenar);

    // Cek apakah semua pasangan sudah dicocokkan
    const allPairsMatched = matchedPairs.length === pasangan.length;

    // Reset pilihan setelah pasangan dicocokkan
    const resetSelection = () => {
        setSelectedKiri(null);
        setSelectedKanan(null);
    };

    // Handle klik pada kata kiri
    const handleKiriClick = (kiri: string) => {
        if (matchedPairs.some((pair) => pair.kiri === kiri)) return; // Sudah dicocokkan
        setSelectedKiri(kiri);
        setError(null);
    };

    // Handle klik pada kata kanan
    const handleKananClick = (kanan: string) => {
        if (!selectedKiri) {
            setError("Pilih kata di sisi kiri terlebih dahulu!");
            return;
        }

        setSelectedKanan(kanan);

        // Cek apakah pasangan benar
        const correctPair = jawabanBenarArray.find(
            (pair) => pair.kiri === selectedKiri
        );
        if (correctPair && correctPair.kanan === kanan) {
            // Pasangan benar
            const newPair = { kiri: selectedKiri, kanan };
            const updatedPairs = [...matchedPairs, newPair];
            setMatchedPairs(updatedPairs);
            onJawabanChange(JSON.stringify(updatedPairs)); // Simpan jawaban
            resetSelection();

            // Jika semua pasangan selesai, lanjut ke soal berikutnya
            if (updatedPairs.length === pasangan.length) {
                onNextSoal();
            }
        } else {
            // Pasangan salah, lanjut ke soal berikutnya
            onJawabanChange(JSON.stringify(matchedPairs)); // Simpan jawaban terakhir
            onNextSoal();
        }
    };

    // Daftar kata kanan yang belum dicocokkan
    const availableKanan = pasangan
        .filter((pair) => !matchedPairs.some((mp) => mp.kanan === pair.kanan))
        .map((pair) => pair.kanan);

    return (
        <div className="mb-4">
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="flex justify-between">
                {/* Sisi Kiri */}
                <div className="w-1/2">
                    <h3 className="text-gray-700 font-semibold mb-2">
                        Kata Kiri
                    </h3>
                    {pasangan.map((pair, index) => (
                        <button
                            key={index}
                            onClick={() => handleKiriClick(pair.kiri)}
                            disabled={matchedPairs.some(
                                (mp) => mp.kiri === pair.kiri
                            )}
                            className={`block w-full text-left p-2 mb-2 rounded-lg border ${
                                matchedPairs.some((mp) => mp.kiri === pair.kiri)
                                    ? "bg-green-100 border-green-300"
                                    : selectedKiri === pair.kiri
                                    ? "bg-blue-100 border-blue-300"
                                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                            }`}
                        >
                            {pair.kiri}
                        </button>
                    ))}
                </div>

                {/* Sisi Kanan */}
                <div className="w-1/2">
                    <h3 className="text-gray-700 font-semibold mb-2">
                        Kata Kanan
                    </h3>
                    {pasangan.map((pair, index) => (
                        <button
                            key={index}
                            onClick={() => handleKananClick(pair.kanan)}
                            disabled={
                                matchedPairs.some(
                                    (mp) => mp.kanan === pair.kanan
                                ) || !availableKanan.includes(pair.kanan)
                            }
                            className={`block w-full text-left p-2 mb-2 rounded-lg border ${
                                matchedPairs.some(
                                    (mp) => mp.kanan === pair.kanan
                                )
                                    ? "bg-green-100 border-green-300"
                                    : selectedKanan === pair.kanan
                                    ? "bg-blue-100 border-blue-300"
                                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                            }`}
                        >
                            {pair.kanan}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CocokKataSoal;
