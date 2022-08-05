import { Outlet } from 'react-router-dom';
import { ReactComponent as Logo } from '../logo.svg';
import { logout } from "../service/supabase";
import Navigator from '../component/Navigator';
import withProtected from '../hoc/withProtected';
import '../style/App.css';


function App() {

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
