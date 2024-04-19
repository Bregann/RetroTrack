import { AppProps } from 'next/app';
import Head from 'next/head';
import { ButtonStylesParams, MantineProvider } from '@mantine/core';
import Navigation from '../components/Nav/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App(props: AppProps) {
  if(process.env.NODE_ENV === 'development' ){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
  
  return (
    <>
      <SessionProvider>
        <Head>
          <title>RetroTrack</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:title" content="RetroTrack" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://retrotrack.bregan.me" />
          <meta property="og:image" content="/rt.png" />
          <meta property="og:description" content="Achievement tracking website for RetroAchievements" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="description" content="RetroTrack is a Tracker for the website RetroAchievements. This Retro Achievement tracking site allows for you to track games, see your inprogress games, see newly added games plus more. New RetroAchievement consoles are added quickly and the site is updated daily." />
        </Head>

        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'dark',
            components: {
              Text: {
                styles: (theme, params: ButtonStylesParams) => ({
                  root: {
                    color: 'white'
                  }
                })
              },
              Table: {
                styles: (theme, params: ButtonStylesParams) => ({
                  root: {
                    color: 'white'
                  },
                  header: {
                    color: 'white'
                  }
                })
              },
              TextInput: {
                styles: (theme, params: ButtonStylesParams) => ({
                  label: {
                    color: 'white'
                  }
                })
              },
              PasswordInput: {
                styles: (theme, params: ButtonStylesParams) => ({
                  label: {
                    color: 'white'
                  }
                })
              }
            }
          }}
        >
          
        <Navigation {...props} />
        </MantineProvider>
      </SessionProvider>

      <ToastContainer />
    </>
  );
}