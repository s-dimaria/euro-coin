import { Link } from 'react-router-dom';

function Navigator({states, onClick}) {

    return(
        <div>
        <ul className="navbar">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="coin">Monete</Link>
            {/* <ul>
              {Object.keys(states)
                .map(element => {
                  return (
                    Object.values(states[element])
                    .map((state) => {
                      return (
                        <li><Link to={`coin/${state}`}>{state}</Link></li>
                      )
                    })
                  )
                }
                ) 
              }
            </ul> */}
          </li>
          <li><a>Album</a>
          {/* DA MODIFICARE NAVIGAZIONE */}
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