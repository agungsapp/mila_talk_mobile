import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const token = localStorage.getItem("auth_token");
    return token ? <Navigate to="/home" /> : <Outlet />;
};

export default PublicRoute;
