import {getLoginUser} from '../service/supabase';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function withLogin(Component) {
  return function WrappedComponent(props) {
    const [authStatus, setAuthStatus] = useState({
      loading: true,
      isAuthenticated: false
    });

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const isAuthenticated = await getLoginUser();
          setAuthStatus({
            loading: false,
            isAuthenticated
          });
        } catch (error) {
          console.error("Auth check error:", error);
          setAuthStatus({
            loading: false,
            isAuthenticated: false
          });
        }
      };

      checkAuth();
    }, []);

    if (authStatus.loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl">Verifying session...</div>
        </div>
      );
    }

    console.log("Authentication status:", authStatus.isAuthenticated);

    return authStatus.isAuthenticated 
      ? <Navigate to="/albums" replace /> 
      : <Component {...props} />;
  };
}

export default withLogin;