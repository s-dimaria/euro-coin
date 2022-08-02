import { Link } from 'react-router-dom';

function Navigator({onClick}) {

    return(
        <div>
        <ul className="navbar">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="coin">Monete</Link>
          </li>
          <li><Link to="album">Album</Link>
            <ul>
              <li><Link to="album/euro">Euro</Link></li>
              <li><Link to="album/commemorative">Commemorative</Link></li>
            </ul>
          </li>
          <div className='nav-right'>
            <li><Link to="/" onClick={onClick}>Logout</Link></li>
          </div>
        </ul>
      </div>
    )
}

export default Navigator;