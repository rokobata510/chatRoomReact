import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
    const token = localStorage.getItem('token'); // Check if the token is present
    return token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
