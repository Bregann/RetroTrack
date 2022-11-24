import { signIn } from "next-auth/react";
import App from "./_app";
import { DoGet } from "../Helpers/webFetchHelper";
const Poo = async () => {
    const res = await DoGet('/api/Navigation/GetLoggedOutGameCounts');

    console.log(await res.json());
}

const Home = () => {
    return ( 
        <>
        <h1>hello2</h1>
        <button onClick={async () => await Poo()}></button>
            
        </>
     );
}
 
export default Home;