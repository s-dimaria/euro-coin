import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

function Navigator({onClick}) {

    const [sticky, setSticky] = useState("")

    useEffect(() => {
      window.addEventListener('scroll', stickNavbar);
      return () => window.removeEventListener('scroll', stickNavbar);
    })

    const stickNavbar = () => {
      if (window !== undefined) {
        let windowHeight = window.scrollY;
        windowHeight > 120 ? setSticky('sticky-nav') : setSticky('');
      }
    };

    return(
        <div>
        <ul className={`navbar ${sticky}`}>
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