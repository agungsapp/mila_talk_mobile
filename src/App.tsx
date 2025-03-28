import { Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import WelcomeScreen from "./pages/WelcomeScreen";
import StartScreen from "./pages/StartScreen";
import RegisterScreen from "./pages/RegisterScreen";
import LoginScreen from "./pages/LoginScreen";
import HomeScreen from "./pages/HomeScreen";
import ProfileScreen from "./pages/ProfileScreen";
import KelasScreen from "./pages/KelasScreen";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import KelasDetailScreen from "./pages/KelasDetailScreen";
import KuisDetailScreen from "./pages/KuisDetailScreen";
import KuisRedirect from "./components/KuisRedirect";
import CariKelasScreen from "./pages/CariKelasScreen";
import PreviewKelasScreen from "./pages/PreviewKelasScreen";
import KuisOverviewScreen from "./pages/KuisOverviewScreen";
import KuisScreen from "./pages/KuisScreen";
import KuisBelumLulusScreen from "./pages/KuisBelumLulusScreen";

function App() {
    return (
        <div className="max-w-md mx-auto min-h-screen bg-orange-50">
            <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route element={<PublicRoute />}>
                    <Route path="/welcome" element={<WelcomeScreen />} />
                    <Route path="/start" element={<StartScreen />} />
                    <Route path="/register" element={<RegisterScreen />} />
                    <Route path="/login" element={<LoginScreen />} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<HomeScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                    <Route path="/kelas" element={<KelasScreen />} />
                    <Route path="/cari-kelas" element={<CariKelasScreen />} />
                    <Route path="/kelas/:id" element={<KelasDetailScreen />} />
                    <Route
                        path="/preview-kelas/:id"
                        element={<PreviewKelasScreen />}
                    />
                    <Route path="/kuis" element={<KuisScreen />} />
                    <Route
                        path="/kuis/belum-lulus"
                        element={<KuisBelumLulusScreen />}
                    />
                    <Route path="/kuis/:id" element={<KuisOverviewScreen />} />
                    <Route
                        path="/kuis/:id/soal/:nomor"
                        element={<KuisDetailScreen />}
                    />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
