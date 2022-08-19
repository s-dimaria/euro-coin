import { keys } from '@mui/system';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fcbgtjrvluvirbkzmxra.supabase.co'
const supabase = createClient(supabaseUrl, process.env.REACT_APP_SUPABASE_KEY);

const getLoginUser = () => {
    console.info("Get User State...")
    return supabase.auth.user() ? true : false;
}

const getUserInfo = () => {
    console.info("Get User Info...")
    return supabase.auth.user();
}

const registerWithEmailAndPassword = async (name, email, password) => {

    console.info("Registration...")
    let { user, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });
    if (error) return alert(error.message);

    return user;

}

const loginWithEmailAndPassword = async (email, password) => {

    console.info("Login...")
    let { user, error } = await supabase.auth.signIn({
        email: email,
        password: password
    });
    if (error) return alert(error.message);

    return user;

}

const loginWithProvider = async (provider) => {

    console.info("Login Provider...")
    let { user, error } = await supabase.auth.signIn({
        provider: provider
    }, {
        redirectTo: "https://s-dimaria.github.io/euro-coin/"
    });
    if (error) return alert(error.message);

    return user;

}

const logout = async () => {

    console.info("Logout...")
    let { error } = await supabase.auth.signOut();

    if (error) return alert(error.message);

}

const sendPasswordReset = async (email) => {
    console.info("Password Reset...")
    let { data, error } = await supabase.auth.api.resetPasswordForEmail(email);
    if (error) return alert(error.message);
    return data;
}

const getStates = async () => {
    console.info("GET States")
    return (await supabase.from("states_eu").select('state_name')).data;
}

const getCoinAndCoinCommWithDetail = async (state) => {
    console.info("GET Coin By States -> " + state)
    return (await supabase.from("states_eu").select('coin, coin_commemorative, detail').eq('state_name', state)).data[0];
}

const getAllStatesWithCoins = async () => {
    return (await supabase.from("states_eu").select('state_name, coin, coin_commemorative')).data;
}

const getAllCoin = async () => {
    return (await supabase.from("states_eu").select('coin')).data;
}

const getAllCoinCommemorative = async () => {
    return (await supabase.from("states_eu").select('coin_commemorative')).data;
}

const getSingleAlbumCoin = async (state, year, value, uuid) => {
    console.log(state, year, value, uuid)
    let { data, error } = await supabase
        .from('album_coin')
        .select('state, year, value, user')
        .eq('state', state)
        .eq('value', value)
        .eq('year', year)
        .eq('user', uuid)
    if (error)
        console.error(error.message)
    else
        return data[0];
}

const putInsertCoin = async (state, year, value, uuid) => {
    console.info("Insert Coin")
    let initialYear = Object.keys((await supabase
        .from('states_eu')
        .select('coin')
        .eq('state_name', state)).data[0].coin)[0];

    if (year >= initialYear) {
        let { data, error } = await supabase
            .from('album_coin')
            .insert([
                { state: state, year: year, value: value, user: uuid }
            ])

        return {data,error};
    }

    return null
}


const putInsertCoinCommemorative = async (state, year, descr, uuid) => {
    console.info("Insert Coin Commemorative")
    let { data, error } = await supabase
        .from('album_commemorative')
        .insert([
            { state: state, year: year, description: descr, user: uuid, value: "2 Euro" }
        ])
    if (error)
        console.error(error.message)
    else
        return data[0];
}

const getFullAlbum = async (uuid) => {
    console.info("Get Coin of user")
    let data = await supabase
        .from('album_coin')
        .select('state, year, value')
        .eq('user', uuid);
    let dataComm = await supabase
        .from('album_commemorative')
        .select('state, year, description')
        .eq('user', uuid);
    data.data = [...data.data, dataComm.data]

    return data.data;
}

const getAlbumCoin = async (uuid) => {
    console.info("Get Coin of user")
    return (await supabase
        .from('album_coin')
        .select('state, year, value')
        .eq('user', uuid)).data;
}

const getAlbumCommemorative = async (uuid) => {
    console.info("Get Commemorative of user")
    return (await supabase
        .from('album_commemorative')
        .select('state, year, description')
        .eq('user', uuid)).data;
}

const deleteCoin = async (state, year, value, uuid) => {
    console.info("Delete Coin...", state, year, value, uuid)
    const { data, error } = await supabase
        .from('album_coin')
        .delete()
        .match({ state: state, year: year, value: value, user: uuid })

    if (error)
        console.log(error)

    return data[0];
}

const deleteCommemorative = async (state, year, description, uuid) => {
    console.info("Delete Coin Commemmorative...")
    const { data, error } = await supabase
        .from('album_commemorative')
        .delete()
        .match({ state: state, year: year, description: description, user: uuid })

    if (error)
        console.log(error)

    return data;
}

const subscribeAlbum = (callback) => {
    let subscribe = supabase
        .from('album_coin')
        .on('INSERT', callback)
        .subscribe()

    return subscribe;
}

export {
    getLoginUser,
    getUserInfo,
    getStates,
    registerWithEmailAndPassword,
    loginWithEmailAndPassword,
    loginWithProvider,
    logout,
    sendPasswordReset,
    getCoinAndCoinCommWithDetail,
    getAllStatesWithCoins,
    getAllCoin,
    getAllCoinCommemorative,
    getSingleAlbumCoin,
    putInsertCoin,
    putInsertCoinCommemorative,
    getFullAlbum,
    getAlbumCoin,
    getAlbumCommemorative,
    deleteCoin,
    deleteCommemorative,
    subscribeAlbum
}