// src/components/KuisRedirect.tsx
import { useParams, Navigate } from "react-router-dom";

const KuisRedirect = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) {
        return <div>Error: Kuis ID tidak ditemukan</div>;
    }
    return <Navigate to={`/kuis/${id}/soal/1`} replace />;
};

export default KuisRedirect;
