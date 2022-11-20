import { AppShell, Burger, MediaQuery, Navbar, NavLink, Header, ScrollArea, Button, Grid, createStyles } from "@mantine/core";
import { AppProps } from "next/app";
import { useState } from "react";
import { useSession } from "next-auth/react"
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const useStyles = createStyles((theme) => ({
    navbar: {
      backgroundColor: theme.colors.dark[6],
      paddingBottom: 0,
    },
    header: {
        backgroundColor: theme.colors.dark[6],
        paddingBottom: 0,
      },
    mainLinks: {
        fontWeight: "bold",
        '&:hover': {
            backgroundColor: theme.colors.dark[5],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black
        }
    },
    subLinks: {
        '&:hover': {
            backgroundColor: theme.colors.dark[5],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black
        }
    }
}));

const Navigation = (props: AppProps) => {
    const { Component, pageProps } = props;
    const [burgerOpened, setBurgerOpened] = useState(false);
    const [loginModalOpened, setLoginModalOpened] = useState(false);
    const [registerModalOpened, setRegisterModalOpened] = useState(false);
    const { data: session, status } = useSession();
    const { classes } = useStyles();


    if(status === "loading"){
        return ( 
            <AppShell
            header={
                <Header height={{base: 70}} className={classes.header} >
                    <Grid>
                        <Grid.Col span={6}>
                        { /* do not display when it's its larger than sm */}
                            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                <Burger
                                    opened={burgerOpened}
                                    onClick={() => setBurgerOpened((o) => !o)}
                                    size="sm"
                                    mr="xl"
                                    style={{marginTop: 20, marginRight: 20}}
                                />
                            </MediaQuery>
                        </Grid.Col>
                    </Grid>
                </Header>
            }>
            <Component {...pageProps} />
        </AppShell>
         );
    }

    if(status === "authenticated"){
        return ( 
            <AppShell
            header={
                <Header height={{base: 70}} className={classes.header}>
                    <Grid>
                        <Grid.Col span={6}>
                        { /* do not display when it's its larger than sm */}
                            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                <Burger
                                    opened={burgerOpened}
                                    onClick={() => setBurgerOpened((o) => !o)}
                                    size="sm"
                                    mr="xl"
                                    style={{marginTop: 20, marginRight: 20}}
                                />
                            </MediaQuery>
                        </Grid.Col>
                        <Grid.Col span={6} sx={{display:'flex', justifyContent:'right'}}>
                            {/* logout button */}
                        </Grid.Col>
                    </Grid>
                </Header>
            }
            navbar={
                <Navbar hiddenBreakpoint="sm" hidden={!burgerOpened} width={{ sm: 200, lg: 300 }} className={classes.navbar}>
                    <Navbar.Section>
                    </Navbar.Section>
                        <NavLink label='Home' component="a" href='/home' className={classes.mainLinks} active={'/home' === window.location.pathname}/>
                        <NavLink label='All Games' component="a" href='/allgames' className={classes.mainLinks} active={'/allgames' === window.location.pathname}/>
                        <NavLink label='Tracked Games' component="a" href='/trackedgames' className={classes.mainLinks} active={'/trackedgames' === window.location.pathname}/>
                        <NavLink label='In Progress Games' component="a" href='/inprogressgames' className={classes.mainLinks} active={'/inprogressgames' === window.location.pathname}/>
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
                <Header height={{base: 70}} className={classes.header}>
                    <Grid>
                        <Grid.Col span={6}>
                        { /* do not display when it's its larger than sm */}
                            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                <Burger
                                    opened={burgerOpened}
                                    onClick={() => setBurgerOpened((o) => !o)}
                                    size="sm"
                                    mr="xl"
                                    style={{marginTop: 20, marginRight: 20}}
                                />
                            </MediaQuery>
                        </Grid.Col>
                        <Grid.Col span={6} sx={{display:'flex', justifyContent:'right'}}>
                            <Button 
                                variant="gradient" 
                                gradient={{ from: 'indigo', to: 'cyan' }} 
                                sx={{marginTop: 15, marginRight: 10}}
                                onClick={() => setLoginModalOpened(true)}>
                                    Login
                            </Button>
                            <Button 
                                variant="gradient" 
                                gradient={{ from: 'teal', to: 'lime', deg: 105 }} 
                                sx={{marginTop: 15, marginRight: 10}}
                                onClick={() => setRegisterModalOpened(true)}>
                                    Register
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Header>
            }
            navbar={
                <Navbar hiddenBreakpoint="sm" hidden={!burgerOpened} width={{ sm: 200, lg: 300 }} className={classes.navbar}>
                    <Navbar.Section>
                    </Navbar.Section>

                <ScrollArea>
                    <NavLink label='Home' component="a" href='/home' className={classes.mainLinks} active={'/home' === window.location.pathname}/>
                    <NavLink label='All Games' component="a" href='/allgames' className={classes.mainLinks} active={'/allgames' === window.location.pathname}/>
                    
                    <NavLink label='Nintendo' className={classes.mainLinks}>
                        <NavLink label='Game Boy' component="a" href='/console/4' active={'/console/4' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Game Boy Color' component="a" href='/console/6' active={'/console/6' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Game Boy Advance' component="a" href='/console/5' active={'/console/5' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='NES' component="a" href='/console/7' active={'/console/7' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='SNES' component="a" href='/console/3' active={'/console/3' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Nintendo 64' component="a" href='/console/2' active={'/console/2' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Nintendo DS' component="a" href='/console/18' active={'/console/18' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Pokemon Mini' component="a" href='/console/24' active={'/console/24' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Virtual Boy' component="a" href='/console/28' active={'/console/28' === window.location.pathname} className={classes.subLinks}/>
                    </NavLink>

                    <NavLink label='Sony' className={classes.mainLinks}>
                        <NavLink label='PlayStation' component="a" href='/console/12' active={'/console/12' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='PlayStation 2' component="a" href='/console/21' active={'/console/21' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='PlayStation Portable' component="a" href='/console/41' active={'/console/41' === window.location.pathname} className={classes.subLinks}/>
                    </NavLink>

                    <NavLink label='Atari' className={classes.mainLinks}>
                        <NavLink label='Atari 2600' component="a" href='/console/25' active={'/console/25' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Atari 7800' component="a" href='/console/51' active={'/console/51' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Atari Jaguar' component="a" href='/console/17' active={'/console/17' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Atari Lynx' component="a" href='/console/13' active={'/console/13' === window.location.pathname} className={classes.subLinks}/>
                    </NavLink>

                    <NavLink label='NEC' className={classes.mainLinks}>
                        <NavLink label='PC Engine' component="a" href='/console/8' active={'/console/8' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='PC-8000' component="a" href='/console/47' active={'/console/47' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='PC-FX' component="a" href='/console/49' active={'/console/49' === window.location.pathname} className={classes.subLinks}/>
                    </NavLink>

                    <NavLink label='Sega' className={classes.mainLinks}>
                        <NavLink label='SG-1000' component="a" href='/console/33' active={'/console/33' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Master System' component="a" href='/console/11' active={'/console/11' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Game Gear' component="a" href='/console/15' active={'/console/15' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Mega Drive' component="a" href='/console/1' active={'/console/1' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Sega CD' component="a" href='/console/9' active={'/console/9' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Sega 32X' component="a" href='/console/10' active={'/console/10' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Sega Saturn' component="a" href='/console/39' active={'/console/39' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Sega Dreamcast' component="a" href='/console/40' active={'/console/40' === window.location.pathname} className={classes.subLinks}/>
                    </NavLink>

                    <NavLink label='Other' className={classes.mainLinks}>
                        <NavLink label='3DO Interactive Multiplayer' component="a" href='/console/43' active={'/console/43' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Amstrad CPC' component="a" href='/console/37' active={'/console/37' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Apple II' component="a" href='/console/38' active={'/console/38' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Arcade' component="a" href='/console/27' active={'/console/27' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Arduboy' component="a" href='/console/71' active={'/console/71' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='ColecoVision' component="a" href='/console/44' active={'/console/44' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Fairchild Channel F' component="a" href='/console/57' active={'/console/57' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Intellivision' component="a" href='/console/45' active={'/console/45' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Magnavox Odyssey 2' component="a" href='/console/23' active={'/console/23' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Mega Duck' component="a" href='/console/69' active={'/console/69' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='MSX' component="a" href='/console/29' active={'/console/29' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Neo Geo Pocket' component="a" href='/console/14' active={'/console/14' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Vectrex' component="a" href='/console/46' active={'/console/46' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='WASM-4' component="a" href='/console/72' active={'/console/72' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='Watara Supervision' component="a" href='/console/63' active={'/console/63' === window.location.pathname} className={classes.subLinks}/>
                        <NavLink label='WonderSwan' component="a" href='/console/53' active={'/console/53' === window.location.pathname} className={classes.subLinks}/>
                    </NavLink>
                </ScrollArea>
                </Navbar>

            }>
            <Component {...pageProps} />

            {/* modals*/}
            <LoginModal setOpened={setLoginModalOpened} openedState={loginModalOpened}/>
            <RegisterModal setOpened={setRegisterModalOpened} openedState={registerModalOpened}/>
        </AppShell>
         );
    }
}

export default Navigation;