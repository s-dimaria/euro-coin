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
      path: 'app',
      element: <App />,
      children: [
      {
        path: 'album',
        element: <Album />,
        children: [
          { 
            path: '', 
            element: <AlbumRoute />
          },
          { 
            path: ':id', 
            element: <AlbumCase />
          }
        ]
      },
      { 
        path: 'coin', 
        element: <Coin />,
        children: [
        { 
          path: '', 
          element: <div></div>
        },
        { 
          path: ':id', 
          element: <CoinStates />
        }
        ]
      }
      ]
    },
  
]);
  return routes;
}

export default AppRoute;
