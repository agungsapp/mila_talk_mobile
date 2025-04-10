// src/components/KelasCard.tsx
import { Link } from "react-router-dom";

interface Dosen {
    id: number;
    nama: string;
}

interface Kelas {
    id: number;
    nama: string;
    deskripsi: string;
    dosen: Dosen;
    is_register?: boolean;
}

interface KelasCardProps {
    kelas: Kelas;
    onDaftar?: (kelasId: number) => Promise<boolean>;
}

const KelasCard: React.FC<KelasCardProps> = ({ kelas, onDaftar }) => {
    const handleDaftarClick = async () => {
        if (onDaftar) {
            const success = await onDaftar(kelas.id);
            if (success) {
                alert("Berhasil mendaftar kelas!");
            } else {
                alert("Gagal mendaftar kelas. Silakan coba lagi.");
            }
        }
    };

    // Jika onDaftar tidak ada (seperti di KelasScreen), anggap kelas sudah terdaftar
    const isRegistered =
        onDaftar === undefined ? true : kelas.is_register || false;
    const detailRoute = isRegistered
        ? `/kelas/${kelas.id}`
        : `/preview-kelas/${kelas.id}`;

    return (
        <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-gray-800">
                {kelas.nama}
            </h3>
            <p className="text-gray-600">{kelas.deskripsi}</p>
            <p className="text-gray-500 text-sm">Dosen: {kelas.dosen.nama}</p>
            <div className="flex gap-2 mt-2">
                <Link
                    to={detailRoute}
                    className="flex-1 text-center py-2 bg-green-500 border-b-[5px] border-green-600 text-white rounded-full hover:bg-green-600 transition duration-200"
                >
                    Lihat Detail
                </Link>
                {onDaftar && (
                    <button
                        onClick={handleDaftarClick}
                        disabled={isRegistered}
                        className={`flex-1 py-2 rounded-full transition duration-200 ${
                            isRegistered
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}
                        title={
                            isRegistered
                                ? "Anda sudah terdaftar di kelas ini"
                                : "Daftar ke kelas"
                        }
                    >
                        {isRegistered ? "Sudah Terdaftar" : "Daftar"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default KelasCard;
