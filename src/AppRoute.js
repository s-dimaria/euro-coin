import { useRoutes } from 'react-router-dom';

import App from "./routes/app";
import Coin from "./routes/coin";
import CoinStates from "./routes/coinStates";
import Home from "./routes/home";
import Album from "./routes/album";
import AlbumCase from './routes/albumCoin';
import Access from './routes/access';
import Register from './routes/register';
import Login from './routes/login';
import Reset from './routes/reset';


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
            element: <p>Seleziona il tuo album dal menù di navigazione</p>
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
