// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import { apiClient, getAuthToken } from "../utils/api";
import TabMenu from "../components/TabMenu";

interface ProfileData {
    name: string;
    email: string;
    image: string;
    created_at: string;
    status: string;
    points: number;
}

const ProfileScreen: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = getAuthToken();
                const response = await apiClient.get("/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(response.data);
                setName(response.data.name);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || "Gagal memuat data profil");
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = getAuthToken();
            const formData = new FormData();
            formData.append("name", name);
            if (image) {
                formData.append("image", image);
            }

            const response = await apiClient.post("/profile/update", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setProfile({
                ...profile!,
                name: response.data.user.name,
                image: response.data.user.image,
            });
            setIsEditing(false);
            setImage(null);
            setPreviewImage(null);
        } catch (err: any) {
            setError(err.message || "Gagal memperbarui profil");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Memuat...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 p-4 pb-20 max-w-md ">
                {/* Header Profil */}
                <div className="flex items-center bg-orange-500 p-4 rounded-lg shadow-md mb-6">
                    <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mr-4">
                        <img
                            src={previewImage || profile?.image}
                            alt="Profil"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-white">
                        <h2 className="text-xl font-bold">{profile?.name}</h2>
                        <p className="text-sm opacity-80">
                            Member sejak {profile?.created_at}
                        </p>
                    </div>
                </div>

                {/* Detail Profil */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Email</span>
                        <span className="text-gray-800">{profile?.email}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Status</span>
                        <span className="text-gray-800">{profile?.status}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Poin</span>
                        <span className="text-orange-500 font-semibold">
                            {profile?.points}
                        </span>
                    </div>
                </div>

                {/* Form Edit Profil */}
                {isEditing ? (
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-4 rounded-lg shadow-md mb-6"
                    >
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">
                                Nama
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">
                                Foto Profil
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-orange-500 text-white py-3 rounded-full font-medium hover:bg-orange-600 transition duration-300"
                            >
                                Simpan
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setImage(null);
                                    setPreviewImage(null);
                                    setName(profile?.name || "");
                                }}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-full font-medium hover:bg-gray-300 transition duration-300"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-orange-500 text-white py-3 rounded-full font-medium hover:bg-orange-600 transition duration-300"
                        >
                            Edit Profil
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-200 text-gray-800 py-3 rounded-full font-medium hover:bg-gray-300 transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
            <TabMenu activeTab="profil" />
        </div>
    );
};

export default ProfileScreen;
