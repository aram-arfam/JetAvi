import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AviContext } from "../Context/AviContext";

const AdminRoute = () => {
  const { userData, loading } = useContext(AviContext);

  if (loading)
    return (
      <div className="text-yellow-500 text-center text-xl mt-10">
        Loading...
      </div>
    );

  return userData?.role === "admin" ? <Outlet /> : <Navigate to="/homepage" />;
};

export default AdminRoute;
