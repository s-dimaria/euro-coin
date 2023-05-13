import { useRoutes } from 'react-router-dom';

import App from "./routes/app";
import Coin from "./routes/coin";
import CoinStates from "./component/CoinStates";
import Home from "./routes/home";
import Album from "./routes/album";
import AlbumRoute from './routes/albumRoute';
import AlbumCase from './routes/albumCase';
import Access from './routes/authentication/Access';
import Register from './routes/authentication/Register';
import Login from './routes/authentication/Login';
import Reset from './routes/authentication/Reset';
import LoadingAlbum from './info/LoadingAlbum';
import Test from './routes/test';


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
      path: 'home', 
      element: <Home />,
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
