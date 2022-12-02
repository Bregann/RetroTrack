import { AppShell, Burger, MediaQuery, Navbar, NavLink, Header, ScrollArea, Button, Grid, createStyles } from "@mantine/core";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react"
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { NavData } from "../../types/App/NavData";
import { DoDelete, DoGet } from "../../Helpers/webFetchHelper";
import Link from "next/link";
import { toast } from "react-toastify";
import { UpdateUserGames } from "../../types/Api/User/UpdateUserGames";
const Getcolour = () => {
    return "red";
    }

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
    const [updateGamesButtonLoading, setUpdateGamesButtonLoading] = useState(false);
    const [navData, setNavData] = useState<NavData | null>(null);
    const { data: session, status } = useSession();
    const { classes } = useStyles();

    const LogoutUser = (sessionId: string) => {
        signOut();
        DoDelete('/api/auth/DeleteUserSession', sessionId);
    
        toast.success('Succesfully logged out', {
            position: 'bottom-right',
            closeOnClick: true,
            theme: 'colored'
        });
    }

    const UpdateUserGames = async (sessionId: string) => {
        setUpdateGamesButtonLoading(true);
        const res = await DoGet('/api/user/UpdateUserGames', sessionId);
        if(res.ok){
            const data: UpdateUserGames = await res.json();
            
            if(!data.success){
                toast.warning(data.reason, {
                    position: 'bottom-right',
                    closeOnClick: true,
                    theme: 'colored'
                });
            }
            else{
                toast.success(data.reason, {
                    position: 'bottom-right',
                    closeOnClick: true,
                    theme: 'colored'
                });
            }
        }

        setUpdateGamesButtonLoading(false);

        //Get the nav for logged in games
    }


    useEffect(() => {
        const fetchData = async () => {
            if(status === "loading"){
                return;
            }
    
            if(status === "unauthenticated"){
                const res = await DoGet('/api/navigation/GetLoggedOutGameCounts');

                const data: NavData = {
                    loggedOut: await res.json()
                }

                console.log(data.loggedOut?.games["4"]);
                setNavData(data);
            }

            if(status === "authenticated"){
                UpdateUserGames(session.sessionId);
            }
        }

        fetchData();

    }, [status])


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

    if(status === "authenticated" && navData){
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
                            gradient={{ from: 'orange', to: 'red' }}
                            sx={{marginTop: 15, marginRight: 10}}
                            onClick={() => UpdateUserGames(session.sessionId)}
                            loading={updateGamesButtonLoading}>
                                Update games
                        </Button>

                        <Button 
                            variant="gradient" 
                            gradient={{ from: 'orange', to: 'red' }}
                            sx={{marginTop: 15, marginRight: 10}}
                            onClick={() => LogoutUser(session.sessionId)}>
                                Logout
                        </Button>
                        </Grid.Col>
                    </Grid>
                </Header>
            }
            navbar={
                <Navbar hiddenBreakpoint="sm" hidden={!burgerOpened} width={{ sm: 200, lg: 300 }} className={classes.navbar}>
                    <Navbar.Section>
                    </Navbar.Section>
                        <NavLink label='Home' component="a" href='/home' className={classes.mainLinks} active={'/home' === window.location.pathname}/>
                        <NavLink label='All Games'component="a" href='/allgames' className={classes.mainLinks} active={'/allgames' === window.location.pathname}/>
                        <NavLink label='Tracked Games'component="a" href='/trackedgames' className={classes.mainLinks} active={'/trackedgames' === window.location.pathname}/>
                        <NavLink label='In Progress Games'component="a" href='/inprogressgames' className={classes.mainLinks} active={'/inprogressgames' === window.location.pathname}/>
                </Navbar>
            }>

            <Component {...pageProps} />
        </AppShell>
         );
    }

    if(status === "unauthenticated" && navData){
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
                    <Link href='/home' passHref style={{ textDecoration: 'none' }}>
                        <NavLink label='Home' className={classes.mainLinks} active={'/home' === window.location.pathname} sx={{color: Getcolour()}}/>
                    </Link>

                    <Link href='/allgames' passHref style={{ textDecoration: 'none' }}>
                        <NavLink label='All Games' className={classes.mainLinks} active={'/allgames' === window.location.pathname}/>
                    </Link>

                    <NavLink label='Nintendo' className={classes.mainLinks}>
                        <Link href='/console/4' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Boy' active={'/console/4' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/6' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Boy Color' active={'/console/6' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/5' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Boy Advance' active={'/console/5' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/7' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='NES' active={'/console/7' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/3' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='SNES' active={'/console/3' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/2' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Nintendo 64' active={'/console/2' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/18' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Nintendo DS' active={'/console/18' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/24' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Pokemon Mini' active={'/console/24' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/28' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Virtual Boy' active={'/console/28' === window.location.pathname} className={classes.subLinks}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Sony' className={classes.mainLinks}>
                        <Link href='/console/12' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PlayStation' active={'/console/12' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/21' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PlayStation 2' active={'/console/21' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/41' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PlayStation Portable' active={'/console/41' === window.location.pathname} className={classes.subLinks}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Atari' className={classes.mainLinks}>
                        <Link href='/console/25' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari 2600' active={'/console/25' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/51' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari 7800' active={'/console/51' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/17' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari Jaguar' active={'/console/17' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/13' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari Lynx' active={'/console/13' === window.location.pathname} className={classes.subLinks}/>
                        </Link>
                    </NavLink>

                    <NavLink label='NEC' className={classes.mainLinks}>
                        <Link href='/console/8' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PC Engine' active={'/console/8' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/47' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PC-8000' active={'/console/47' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/49' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PC-FX' active={'/console/49' === window.location.pathname} className={classes.subLinks}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Sega' className={classes.mainLinks}>
                        <Link href='/console/33' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='SG-1000' active={'/console/33' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/11' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Master System' active={'/console/11' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/15' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Gear' active={'/console/15' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/1' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Mega Drive' active={'/console/1' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/9' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega CD' active={'/console/9' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/10' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega 32X' active={'/console/10' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/39' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega Saturn' active={'/console/39' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/40' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega Dreamcast' active={'/console/40' === window.location.pathname} className={classes.subLinks}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Other' className={classes.mainLinks}>
                        <Link href='/console/43' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='3DO Interactive Multiplayer' active={'/console/43' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/37' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Amstrad CPC' active={'/console/37' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/38' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Apple II' active={'/console/38' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/27' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Arcade' active={'/console/27' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/71' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Arduboy' active={'/console/71' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/44' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='ColecoVision' active={'/console/44' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/57' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Fairchild Channel F' active={'/console/57' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/45' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Intellivision' active={'/console/45' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/23' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Magnavox Odyssey 2' active={'/console/23' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/69' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Mega Duck' active={'/console/69' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/29' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='MSX' active={'/console/29' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/14' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Neo Geo Pocket' active={'/console/14' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/46' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Vectrex' active={'/console/46' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/72' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='WASM-4' active={'/console/72' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/63' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Watara Supervision' active={'/console/63' === window.location.pathname} className={classes.subLinks}/>
                        </Link>

                        <Link href='/console/53' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='WonderSwan'active={'/console/53' === window.location.pathname} className={classes.subLinks}/>
                        </Link>
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