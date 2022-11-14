import { AppShell, Burger, MediaQuery, Navbar, NavLink, Header, ScrollArea } from "@mantine/core";
import { AppProps } from "next/app";
import { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useSession } from "next-auth/react"

const Navigation = (props: AppProps) => {
    const { Component, pageProps } = props;
    const [opened, setOpened] = useState(false);
    const { data: session, status } = useSession()

    console.log(session);

    if(status === "authenticated"){
        return ( 
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
                            {/* logour buttons here */}
                            </Col>
                        </Row>
                    </Container>
                </Header>
            }
            navbar={
                <Navbar hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
                    <Navbar.Section>
                    </Navbar.Section>
                        <NavLink label='home' component="a" href='/home'/>
                        <NavLink label='allgames' component="a" href='/allgames'/>
                        <NavLink label='trackedgames' component="a" href='/trackedgames'/>
                        <NavLink label='inprogressgames' component="a" href='/inprogressgames'/>



                </Navbar>
            }>
            <Component {...pageProps} />
        </AppShell>
         );
    }
    else{
        return ( 
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
                            {/* login buttons here */}
                            </Col>
                        </Row>
                    </Container>
                </Header>
            }
            navbar={
                <Navbar hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
                    <Navbar.Section>
                    </Navbar.Section>
                <NavLink label='Home' component="a" href='/home'/>
                <NavLink label='All Games' component="a" href='/allgames'/>
                <ScrollArea>
                    <NavLink label='Nintendo'>
                        <NavLink label='Game Boy' component="a" href='/console/4'/>
                        <NavLink label='Game Boy Color' component="a" href='/console/6'/>
                        <NavLink label='Game Boy Advance' component="a" href='/console/5'/>
                        <NavLink label='NES' component="a" href='/console/7'/>
                        <NavLink label='SNES' component="a" href='/console/3'/>
                        <NavLink label='Nintendo 64' component="a" href='/console/2'/>
                        <NavLink label='Nintendo DS' component="a" href='/console/18'/>
                        <NavLink label='Pokemon Mini' component="a" href='/console/24'/>
                        <NavLink label='Virtual Boy' component="a" href='/console/28'/>
                    </NavLink>

                    <NavLink label='Sony'>
                        <NavLink label='PlayStation' component="a" href='/console/12'/>
                        <NavLink label='PlayStation 2' component="a" href='/console/21'/>
                        <NavLink label='PlayStation Portable' component="a" href='/console/41'/>
                    </NavLink>

                    <NavLink label='Atari'>
                        <NavLink label='Atari 2600' component="a" href='/console/25'/>
                        <NavLink label='Atari 7800' component="a" href='/console/51'/>
                        <NavLink label='Atari Jaguar' component="a" href='/console/17'/>
                        <NavLink label='Atari Lynx' component="a" href='/console/13'/>
                    </NavLink>

                    <NavLink label='NEC'>
                        <NavLink label='PC Engine' component="a" href='/console/8'/>
                        <NavLink label='PC-8000' component="a" href='/console/47'/>
                        <NavLink label='PC-FX' component="a" href='/console/49'/>
                    </NavLink>

                    <NavLink label='Sega'>
                        <NavLink label='SG-1000' component="a" href='/console/33'/>
                        <NavLink label='Master System' component="a" href='/console/11'/>
                        <NavLink label='Game Gear' component="a" href='/console/15'/>
                        <NavLink label='Mega Drive' component="a" href='/console/1'/>
                        <NavLink label='Sega CD' component="a" href='/console/9'/>
                        <NavLink label='Sega 32X' component="a" href='/console/10'/>
                        <NavLink label='Sega Saturn' component="a" href='/console/39'/>
                        <NavLink label='Sega Dreamcast' component="a" href='/console/40'/>
                    </NavLink>

                    <NavLink label='Other'>
                        <NavLink label='3DO Interactive Multiplayer' component="a" href='/console/43'/>
                        <NavLink label='Amstrad CPC' component="a" href='/console/37'/>
                        <NavLink label='Apple II' component="a" href='/console/38'/>
                        <NavLink label='Arcade' component="a" href='/console/27'/>
                        <NavLink label='Arduboy' component="a" href='/console/71'/>
                        <NavLink label='ColecoVision' component="a" href='/console/44'/>
                        <NavLink label='Fairchild Channel F' component="a" href='/console/57'/>
                        <NavLink label='Intellivision' component="a" href='/console/45'/>
                        <NavLink label='Magnavox Odyssey 2' component="a" href='/console/23'/>
                        <NavLink label='Mega Duck' component="a" href='/console/69'/>
                        <NavLink label='MSX' component="a" href='/console/29'/>
                        <NavLink label='Neo Geo Pocket' component="a" href='/console/14'/>
                        <NavLink label='Vectrex' component="a" href='/console/46'/>
                        <NavLink label='WASM-4' component="a" href='/console/72'/>
                        <NavLink label='Watara Supervision' component="a" href='/console/63'/>
                        <NavLink label='WonderSwan' component="a" href='/console/53'/>
                    </NavLink>
                </ScrollArea>
                </Navbar>

            }>
            <Component {...pageProps} />
        </AppShell>
         );
    }


}
 
export default Navigation;