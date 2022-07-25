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
    let { user, session, error } = await supabase.auth.signIn({
        provider: provider
    });
    if (error) return alert(error.message);

    return user;

}

const logout = async () => {

    console.info("Logout...")
    let { error } = await supabase.auth.signOut();

    if (error) return alert(error.message);

}

const getStates = async () => {
    console.info("GET States")
    return (await supabase.from("states_eu").select('state_name')).data;
}

const getCoinByStates = async (state) => {
    console.info("GET Coin By States -> " + state)
    return (await supabase.from("states_eu").select('coin').eq('state_name', state)).data[0].coin;
}

const putInsertCoin = async (state, year, value, uuid) => {
    console.info("Insert Coin")
    let { data, error } = await supabase
        .from('album_coin')
        .insert([
            { state: state, year: year, value: value, user: uuid }
        ])
    if(error)
        error.code === "23502" ? alert("Campi non inseriti") : alert("Moneta già esiste")
    else
        return data[0];
}

const putInsertCoinCommemorative = async (state, year, value, bool, descr, uuid) => {
    console.info("Insert Coin Commemorative")
    let { data, error } = await supabase
        .from('album_coin')
        .insert([
            { state: state, year: year, value: value, user: uuid, commemorative: bool, description: descr }
        ])
    if(error)
        error.code === "23502" ? alert("Campi non inseriti") : alert("Moneta già esiste")
    else
        return data[0];
}

const getAlbum = async (uuid) => {
    console.info("Get Coin of user")
    return (await supabase
    .from('album_coin')
    .select('state, year, value')
        .eq('user', uuid)).data;
}

const getAlbumNoComm = async (uuid) => {
    console.info("Get Coin of user")
    return (await supabase
    .from('album_coin')
    .select('state, year, value')
        .eq('user', uuid)
        .eq('commemorative',false)).data;
}

const getAlbumCommemorative = async (uuid) => {
    console.info("Get Coin of user")
    return (await supabase
    .from('album_coin')
    .select('state, year, description')
        .eq('user', uuid)
        .eq('commemorative',true)).data;
}

const subscribeAlbum = (callback) => {
    let subscribe = supabase
    .from('album_coin')
    .on('INSERT', callback)
    .subscribe()
}

export { 
    getLoginUser,
    getUserInfo, 
    getStates, 
    registerWithEmailAndPassword, 
    loginWithEmailAndPassword, 
    loginWithProvider,
    logout, 
    getCoinByStates, 
    putInsertCoin,
    putInsertCoinCommemorative,
    getAlbum,
    getAlbumNoComm,
    getAlbumCommemorative,
    subscribeAlbum
}