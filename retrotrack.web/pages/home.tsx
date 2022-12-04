import { signIn, useSession } from "next-auth/react";
import App from "./_app";
import { DoGet } from "../Helpers/webFetchHelper";
import { Text } from "@mantine/core";
import { GetServerSideProps } from "next";
const Home = () => {
    const { data: session, status } = useSession();

    return ( 
        <>
            {status === "authenticated" && <Text size={55} align="center">Welcome back, {session.username}!</Text>}
            {status === "unauthenticated" && <h1>Home</h1>}
        </>
     );
}
 
export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {}, // will be passed to the page component as props
        }
  }
export default Home;