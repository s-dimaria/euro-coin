import { useRoutes } from 'react-router-dom';

import CoinStates from "./component/CoinStates";
import Home from "./routes/home";
import Access from './routes/authentication/Access';
import Register from './routes/authentication/Register';
import Login from './routes/authentication/Login';
import Reset from './routes/authentication/Reset';


function AppRoute() {
  
  let routes = useRoutes([
    { 
      path: '/*', 
      element: <Access />
    },
    { 
      path: 'login', 
      element: <Login />
    },
    { 
      path: 'reset', 
      element: <Reset />
    },
    { 
      path: 'register', 
      element: <Register />
    },
    { 
      path: 'albums', 
      element: <Home />,
    },
    { 
      path: 'albums/:id', 
      element: <CoinStates />,
    },
  
]);
  return routes;
}

export default AppRoute;
