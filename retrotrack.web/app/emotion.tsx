'use client';

{/* temp due to mantine not supporting nextjs 13 yet https://github.com/mantinedev/mantine/issues/2815*/}

import 'bootstrap/dist/css/bootstrap.min.css';
import { ActionIcon, AppShell, Burger, ColorScheme, ColorSchemeProvider, Header, MantineProvider, MediaQuery, Navbar, NavLink, useEmotionCache } from "@mantine/core";
import { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import Image from 'next/image'
import { IconMoonStars, IconSun } from '@tabler/icons';
import retroTrackLogo from '../public/logo.png';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';

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

  const [opened, setOpened] = useState(false);


  return (
    <CacheProvider value={cache}>
        <MantineProvider theme={{colorScheme: 'dark'}} withGlobalStyles withNormalizeCSS>
            <AppShell
                header={
                    <Header height={{base: 70}}>
                        <Container fluid>
                            <Row>
                                <Col>
                                { /* do not display when it's its larger than sm */}
                                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                        <Burger
                                            opened={opened}
                                            onClick={() => setOpened((o) => !o)}
                                            size="sm"
                                            mr="xl"
                                            style={{marginTop: 20, marginRight: 20}}
                                        />
                                    </MediaQuery>
                                </Col>
                                <Col>

                                </Col>
                            </Row>
                        </Container>
                    </Header>
                }
                navbar={
                    <Navbar hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
                        <Navbar.Section>
                            <Image src={retroTrackLogo} alt="website logo" width={250} height={100}/>
                        </Navbar.Section>
                    <NavLink label='home' component="a" href='/home'/>
                    </Navbar>
                }
                >
                {children}
            </AppShell>
        </MantineProvider>
    </CacheProvider>
  );
}