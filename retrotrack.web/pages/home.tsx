import { signIn } from "next-auth/react";
import App from "./_app";

const Home = () => {
    return ( 
        <>
        <h1>hello2</h1>
        <button onClick={async () => await signIn('credentials', {
            username: "lol",
            password: "lol2",
            redirect: false,
            })}>hello</button>
            
        </>
     );
}
 
export default Home;