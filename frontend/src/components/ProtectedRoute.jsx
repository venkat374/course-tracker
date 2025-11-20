import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ authToken, children }) => {
    if(!authToken) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;