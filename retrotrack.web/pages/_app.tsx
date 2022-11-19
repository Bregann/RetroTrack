import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import Navigation from '../components/App/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App(props: AppProps) {
  if(process.env.NODE_ENV === 'development' ){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
  const { Component, pageProps } = props;
  
  return (
    <>
      <SessionProvider>
        <Head>
          <title>RetroTrack</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>

        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'dark',
          }}
        >
          
          <Navigation {...props} />
          <Component {...props} />
        </MantineProvider>
      </SessionProvider>

      <ToastContainer />
    </>
  );
}