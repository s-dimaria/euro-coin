import {getLoginUser} from '../service/supabase';
import {Navigate} from 'react-router-dom';

function withProtected (Component) {

    return ((...props) => {

        let user = getLoginUser();
        
        return user ? <Component {...props}/> : <Navigate to="/" replace={true}/>
    })

}

export default withProtected;