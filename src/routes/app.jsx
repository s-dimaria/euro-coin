import '../style/App.css';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ReactComponent as Logo } from '../logo.svg';
import { getStates, logout } from "../service/supabase";
import Navigator from '../component/Navigator';
import withProtected from '../hoc/withProtected';


function App() {

  // const [states, setStates] = useState([]);

  // useEffect(() => {

  //   let ignore = false;

  //   async function startFetching() {
  //     const json = await getStates();
  //     if (!ignore) {
  //       console.info("Done");
  //       setStates(json)
  //     }
  //   }
  //   startFetching();

  //   return () => { ignore = true };
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo">
          <Logo />
        </div>
        <h1>Euro Coins</h1>
      </header>
      <Navigator 
        onClick={logout}>
      </Navigator>
      <div className="App-body">
        <Outlet />
      </div>
    </div>
  );
}

export default withProtected(App);
