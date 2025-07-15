import {getLoginUser} from '../service/supabase';
import {Navigate} from 'react-router-dom';
import { useState, useEffect } from 'react';


function withProtected(Component) {
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

    console.debug("Authentication status:", authStatus.isAuthenticated);

    return authStatus.isAuthenticated 
      ? <Component {...props}/>
      : <Navigate to="/" replace={true}/>;
  };
}

export default withProtected;