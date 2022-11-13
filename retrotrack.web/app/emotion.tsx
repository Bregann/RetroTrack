'use client';

{/* temp due to mantine not supporting nextjs 13 yet https://github.com/mantinedev/mantine/issues/2815*/}

import 'bootstrap/dist/css/bootstrap.min.css';
import {  MantineProvider, useEmotionCache } from "@mantine/core";
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { SessionProvider } from "next-auth/react";
import Nav from './nav';

export default function RootStyleRegistry({ children }: { children: React.ReactNode }) {
  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  return (
    <SessionProvider>
        <CacheProvider value={cache}>
            <MantineProvider theme={{colorScheme: 'dark'}} withGlobalStyles withNormalizeCSS>
                <Nav>
                    {children}
                </Nav>
            </MantineProvider>
        </CacheProvider>
    </SessionProvider>
  );
}