// src/components/MediaSoal.tsx
import React from "react";

interface MediaSoalProps {
    tipe: "tebak_gambar" | "mendengarkan";
    mediaUrl: string;
    opsi: { [key: string]: string };
    soalId: number;
    selectedJawaban: string | undefined;
    onJawabanChange: (soalId: number, jawaban: string) => void;
}

const MediaSoal: React.FC<MediaSoalProps> = ({
    tipe,
    mediaUrl,
    opsi,
    soalId,
    selectedJawaban,
    onJawabanChange,
}) => {
    return (
        <div>
            {tipe === "tebak_gambar" && (
                <img
                    src={mediaUrl}
                    alt="Gambar"
                    className="w-full max-w-xs mx-auto mb-4 rounded-lg"
                    onError={(event) => {
                        // Baris 41: Ganti '_' dengan 'event'
                        console.error("Gagal memuat gambar:", mediaUrl);
                        event.currentTarget.src =
                            "https://via.placeholder.com/150?text=Gambar+Tidak+Ditemukan";
                    }}
                />
            )}

            {tipe === "mendengarkan" && (
                <audio
                    controls
                    src={mediaUrl}
                    className="w-full mb-4"
                    onError={() => {
                        console.error("Gagal memuat audio:", mediaUrl);
                    }}
                />
            )}

            {opsi &&
                Object.entries(opsi).map(([key, value]) => (
                    <div key={key} className="mb-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name={`soal-${soalId}`}
                                value={key}
                                checked={selectedJawaban === key}
                                onChange={() => onJawabanChange(soalId, key)}
                                className="mr-2"
                            />
                            <span className="text-gray-700">
                                {key}. {value}
                            </span>
                        </label>
                    </div>
                ))}
        </div>
    );
};

export default MediaSoal;
