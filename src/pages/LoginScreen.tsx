import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const LoginScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState<string | null>(null);

    // Validasi lokal realtime
    const validateField = (name: string, value: string) => {
        const newErrors: Record<string, string> = { ...errors };

        switch (name) {
            case "email":
                if (!value) newErrors.email = "Email wajib diisi.";
                else if (!/\S+@\S+\.\S+/.test(value))
                    newErrors.email = "Email tidak valid.";
                else delete newErrors.email;
                break;
            case "password":
                if (!value) newErrors.password = "Password wajib diisi.";
                else delete newErrors.password;
                break;
        }
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validasi realtime
        const newErrors = validateField(name, value);
        setErrors(newErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);

        // Validasi semua field sebelum submit
        const allErrors: Record<string, string> = {};
        Object.keys(formData).forEach((key) => {
            const fieldErrors = validateField(
                key,
                formData[key as keyof typeof formData]
            );
            Object.assign(allErrors, fieldErrors);
        });
        setErrors(allErrors);

        if (Object.keys(allErrors).length > 0) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/login`,
                {
                    email: formData.email,
                    password: formData.password,
                }
            );
            // Simpan token ke localStorage
            const token = response.data.token;
            localStorage.setItem("auth_token", token);
            setSuccess("Login berhasil, mengarahkan ke halaman utama...");
            setTimeout(() => navigate("/home"), 2000); // Redirect setelah 2 detik
        } catch (err) {
            const error = err as AxiosError<{
                message: string;
                errors?: Record<string, string[]>;
            }>;
            if (error.response?.data?.errors) {
                const apiErrors: Record<string, string> = {};
                Object.keys(error.response.data.errors).forEach((key) => {
                    apiErrors[key] = error.response.data.errors![key][0];
                });
                setErrors(apiErrors);
            } else {
                setErrors({
                    general:
                        error.response?.data?.message ||
                        "Terjadi kesalahan saat login.",
                });
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Masuk Akun
            </h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <div className="mb-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.email ? "border-red-500" : ""
                        }`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.password ? "border-red-500" : ""
                        }`}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                {errors.general && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {errors.general}
                    </p>
                )}
                {success && (
                    <p className="text-green-500 text-sm mb-4 text-center">
                        {success}
                    </p>
                )}

                <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-3 rounded-full w-full hover:bg-orange-600 transition duration-300"
                >
                    Masuk
                </button>
            </form>
            <p className="mt-4 text-gray-600">
                Belum punya akun?{" "}
                <span
                    onClick={() => navigate("/register")}
                    className="text-orange-500 cursor-pointer hover:underline"
                >
                    Daftar
                </span>
            </p>
        </div>
    );
};

export default LoginScreen;
