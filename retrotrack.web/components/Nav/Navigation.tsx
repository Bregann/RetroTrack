import { AppShell, Burger, MediaQuery, Navbar, NavLink, Header, ScrollArea, Button, Grid, createStyles, LoadingOverlay, Stack, Text, Paper } from "@mantine/core";
import { AppProps } from "next/app";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react"
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { DoDelete, DoGet } from "../../Helpers/webFetchHelper";
import Link from "next/link";
import { toast } from "react-toastify";
import { UpdateUserGames } from "../../types/Api/User/UpdateUserGames";
import { NavData } from "../../types/Api/Navigation/NavGameCounts";
import Image from 'next/image'
import { UserNavProfile } from "../../types/Api/Navigation/UserNavProfile";

const getColour = (perc: number) => {
    var r, g, b = 0;
    if(perc < 50) {
        r = 255;
        g = Math.round(5.1 * perc);
    }
    else {
        g = 255;
        r = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
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
    },
    footer: {
        marginBottom: 10
    }
}));

const Navigation = (props: AppProps) => {
    const { Component, pageProps } = props;
    const [burgerOpened, setBurgerOpened] = useState(false);
    const [loginModalOpened, setLoginModalOpened] = useState(false);
    const [registerModalOpened, setRegisterModalOpened] = useState(false);
    const [updateGamesButtonLoading, setUpdateGamesButtonLoading] = useState(false);
    const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false);
    const [userUpdateRequested, setUserUpdateRequested] = useState(false);
    const [navData, setNavData] = useState<NavData | null>(null);
    const [profileData, setProfileData] = useState<UserNavProfile>();

    const { data: session, status } = useSession();
    const { classes } = useStyles();
    const interval = useRef<NodeJS.Timeout | null>(null);

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
        const updateRes = await DoGet('/api/user/UpdateUserGames', sessionId);
        if(updateRes.ok){
            const data: UpdateUserGames = await updateRes.json();
            
            if(!data.success){
                toast.warning(data.reason, {
                    position: 'bottom-right',
                    closeOnClick: true,
                    theme: 'colored'
                });
            }
            else{
                toast.info(data.reason, {
                    position: 'bottom-right',
                    closeOnClick: true,
                    theme: 'colored'
                });
            }
        }
        
        setUserUpdateRequested(true);
        setUpdateGamesButtonLoading(false);
    }

    const GetUserNavData = async (sessionId: string) => {
        const gameCountsRes = await DoGet('/api/navigation/GetLoggedInGameCounts', sessionId);

        let data: NavData = {
            loggedIn: undefined
        };

        if(gameCountsRes.ok){
            const gameCountsResData = await gameCountsRes.json();
            data.loggedIn = gameCountsResData;
        }

        const profileDataRes = await DoGet('/api/navigation/GetUserNavProfile', sessionId);

        let profileData: UserNavProfile | undefined = undefined;

        if(profileDataRes.ok){
            profileData = await profileDataRes.json();
        }

        setProfileData(profileData);
        setNavData(data);
        setLoadingOverlayVisible(false);
    }

    //Used for checking the status of a user update
    useEffect(() => {
        if(userUpdateRequested && !interval.current){
            interval.current = setInterval(async () => {
                const res = await DoGet('/api/user/CheckUserUpdateProcessingState', session?.sessionId);
        
                if(res.ok){
                    const processed: boolean = await res.json();
        
                    if(processed){
                        setUserUpdateRequested(false);
                        await GetUserNavData(session?.sessionId!);
                        
                        toast.success("User update successful", {
                            position: 'bottom-right',
                            closeOnClick: true,
                            theme: 'colored'
                        });
                    }
                }
            }, 5000)
        }

        if(!userUpdateRequested && interval.current){
            clearInterval(interval.current);
            interval.current = null;
        }
    }, [session?.sessionId, userUpdateRequested])

    useEffect(() => {
        const fetchData = async () => {
            console.log(status);
            if(status === "loading"){
                setLoadingOverlayVisible(true);
                return;
            }
    
            if(status === "unauthenticated"){
                const res = await DoGet('/api/navigation/GetLoggedOutGameCounts');

                let data: NavData = {
                    loggedOut: undefined
                };
        
                if(res.ok){
                    data.loggedOut = await res.json();
                }

                setNavData(data);
                setLoadingOverlayVisible(false);
            }

            if(status === "authenticated"){
                GetUserNavData(session.sessionId);
                UpdateUserGames(session.sessionId);
            }
        }

        fetchData();

    }, [session?.sessionId, status])

    if(status === "loading" || status === "authenticated" && !navData || status === "unauthenticated" && !navData){
        return ( 
            <div style={{position: 'relative' }}>
                <LoadingOverlay visible={loadingOverlayVisible} overlayBlur={2} />
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
            </div>
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
                            gradient={{ from: 'indigo', to: 'cyan' }}
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
                <Navbar.Section grow component={ScrollArea}>
                    <Link href='/home' passHref style={{ textDecoration: 'none' }}>
                        <NavLink label='Home' className={classes.mainLinks} active={'/home' === window.location.pathname}/>
                    </Link>

                    <Link href='/allgames' passHref style={{ textDecoration: 'none' }}>
                        <NavLink label='All Games' className={classes.mainLinks} active={'/allgames' === window.location.pathname} description={navData.loggedIn?.games["-1"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["-1"].percentage!)}}}/>
                    </Link>

                    <Link href='/trackedgames' passHref style={{ textDecoration: 'none' }}>
                        <NavLink label='Tracked Games' className={classes.mainLinks} active={'/trackedgames' === window.location.pathname} description={navData.loggedIn?.gamesTracked + " games"} />
                    </Link>
                    
                    <Link href='/inprogressgames' passHref style={{ textDecoration: 'none' }}>
                        <NavLink label='In Progress Games' className={classes.mainLinks} active={'/inprogressgames' === window.location.pathname} description={navData.loggedIn?.inProgressGames + " games"} />
                    </Link>

                    <NavLink label='Nintendo' className={classes.mainLinks}>
                        <Link href='/console/4' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Boy' active={'/console/4' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["4"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["4"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/6' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Boy Color' active={'/console/6' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["6"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["6"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/5' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Boy Advance' active={'/console/5' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["5"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["5"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/7' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='NES' active={'/console/7' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["7"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["7"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/3' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='SNES' active={'/console/3' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["3"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["3"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/2' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Nintendo 64' active={'/console/2' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["2"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["2"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/18' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Nintendo DS' active={'/console/18' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["18"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["18"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/24' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Pokemon Mini' active={'/console/24' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["44"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["44"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/28' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Virtual Boy' active={'/console/28' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["28"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["28"].percentage!)}}}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Sony' className={classes.mainLinks}>
                        <Link href='/console/12' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PlayStation' active={'/console/12' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["12"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["12"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/21' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PlayStation 2' active={'/console/21' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["21"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["21"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/41' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PlayStation Portable' active={'/console/41' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["41"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["41"].percentage!)}}}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Atari' className={classes.mainLinks}>
                        <Link href='/console/25' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari 2600' active={'/console/25' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["25"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["25"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/51' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari 7800' active={'/console/51' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["51"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["51"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/17' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari Jaguar' active={'/console/17' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["17"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["17"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/13' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari Lynx' active={'/console/13' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["13"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["13"].percentage!)}}}/>
                        </Link>
                    </NavLink>

                    <NavLink label='NEC' className={classes.mainLinks}>
                        <Link href='/console/8' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PC Engine' active={'/console/8' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["8"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["8"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/47' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PC-8000' active={'/console/47' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["47"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["47"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/49' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PC-FX' active={'/console/49' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["49"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["49"].percentage!)}}}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Sega' className={classes.mainLinks}>
                        <Link href='/console/33' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='SG-1000' active={'/console/33' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["33"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["33"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/11' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Master System' active={'/console/11' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["11"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["11"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/15' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Gear' active={'/console/15' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["15"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["15"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/1' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Mega Drive' active={'/console/1' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["1"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["1"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/9' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega CD' active={'/console/9' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["9"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["9"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/10' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega 32X' active={'/console/10' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["10"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["10"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/39' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega Saturn' active={'/console/39' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["39"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["39"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/40' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega Dreamcast' active={'/console/40' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["40"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["40"].percentage!)}}}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Other' className={classes.mainLinks}>
                        <Link href='/console/43' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='3DO Interactive Multiplayer' active={'/console/43' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["43"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["43"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/37' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Amstrad CPC' active={'/console/37' === window.location.pathname} className={classes.subLinks}  description={navData.loggedIn?.games["37"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["37"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/38' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Apple II' active={'/console/38' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["38"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["38"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/27' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Arcade' active={'/console/27' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["27"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["27"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/71' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Arduboy' active={'/console/71' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["71"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["71"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/44' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='ColecoVision' active={'/console/44' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["44"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["44"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/57' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Fairchild Channel F' active={'/console/57' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["57"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["57"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/45' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Intellivision' active={'/console/45' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["45"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["45"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/23' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Magnavox Odyssey 2' active={'/console/23' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["23"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["23"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/69' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Mega Duck' active={'/console/69' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["69"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["69"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/29' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='MSX' active={'/console/29' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["29"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["29"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/14' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Neo Geo Pocket' active={'/console/14' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["14"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["14"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/46' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Vectrex' active={'/console/46' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["46"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["46"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/72' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='WASM-4' active={'/console/72' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["72"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["72"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/63' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Watara Supervision' active={'/console/63' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["63"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["63"].percentage!)}}}/>
                        </Link>

                        <Link href='/console/53' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='WonderSwan'active={'/console/53' === window.location.pathname} className={classes.subLinks} description={navData.loggedIn?.games["53"].gamesTotalAndCompleted} styles={{description: {color: getColour(navData.loggedIn?.games["53"].percentage!)}}}/>
                        </Link>
                    </NavLink>
                </Navbar.Section>

                <Navbar.Section className={classes.footer}>
                    <Paper mr={5} mt={10}>
                    <Grid pt={5} pl={5}>
                        <Grid.Col span={4}>
                        <Image
                            src={profileData?.profileImageUrl!}
                            alt="Profile picture of user"
                            width={100}
                            height={100}
                            />
                        </Grid.Col>
                        <Grid.Col span={8}>
                            <Text fz="md" fw={700} pl={5}>{profileData?.username}</Text>
                            <Text fz="md" pl={5}>Games 100%: <b>{profileData?.gamesCompleted}</b></Text>
                            <Text fz="md" pl={5}>Points: <b>{profileData?.points}</b></Text>
                            <Text fz="md" pl={5}>Rank: <b>{profileData?.rank}</b></Text>
                        </Grid.Col>
                    </Grid>
                    </Paper>
                </Navbar.Section>
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
                        <NavLink label='Home' className={classes.mainLinks} active={'/home' === window.location.pathname}/>
                    </Link>

                    <Link href='/allgames' passHref style={{ textDecoration: 'none' }}>
                        <NavLink label='All Games' className={classes.mainLinks} active={'/allgames' === window.location.pathname} description={navData.loggedOut?.games["-1"] + " games"}/>
                    </Link>

                    <NavLink label='Nintendo' className={classes.mainLinks}>
                        <Link href='/console/4' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Boy' active={'/console/4' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["4"] + " games"}/>
                        </Link>

                        <Link href='/console/6' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Boy Color' active={'/console/6' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["6"] + " games"}/>
                        </Link>

                        <Link href='/console/5' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Boy Advance' active={'/console/5' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["5"] + " games"}/>
                        </Link>

                        <Link href='/console/7' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='NES' active={'/console/7' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["7"] + " games"}/>
                        </Link>

                        <Link href='/console/3' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='SNES' active={'/console/3' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["3"] + " games"}/>
                        </Link>

                        <Link href='/console/2' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Nintendo 64' active={'/console/2' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["2"] + " games"}/>
                        </Link>

                        <Link href='/console/18' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Nintendo DS' active={'/console/18' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["18"] + " games"}/>
                        </Link>

                        <Link href='/console/24' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Pokemon Mini' active={'/console/24' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["24"] + " games"}/>
                        </Link>

                        <Link href='/console/28' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Virtual Boy' active={'/console/28' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["28"] + " games"}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Sony' className={classes.mainLinks}>
                        <Link href='/console/12' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PlayStation' active={'/console/12' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["12"] + " games"}/>
                        </Link>

                        <Link href='/console/21' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PlayStation 2' active={'/console/21' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["21"] + " games"}/>
                        </Link>

                        <Link href='/console/41' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PlayStation Portable' active={'/console/41' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["41"] + " games"}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Atari' className={classes.mainLinks}>
                        <Link href='/console/25' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari 2600' active={'/console/25' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["25"] + " games"}/>
                        </Link>

                        <Link href='/console/51' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari 7800' active={'/console/51' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["51"] + " games"}/>
                        </Link>

                        <Link href='/console/17' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari Jaguar' active={'/console/17' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["17"] + " games"}/>
                        </Link>

                        <Link href='/console/13' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Atari Lynx' active={'/console/13' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["13"] + " games"}/>
                        </Link>
                    </NavLink>

                    <NavLink label='NEC' className={classes.mainLinks}>
                        <Link href='/console/8' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PC Engine' active={'/console/8' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["8"] + " games"}/>
                        </Link>

                        <Link href='/console/47' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PC-8000' active={'/console/47' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["47"] + " games"}/>
                        </Link>

                        <Link href='/console/49' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='PC-FX' active={'/console/49' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["49"] + " games"}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Sega' className={classes.mainLinks}>
                        <Link href='/console/33' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='SG-1000' active={'/console/33' === window.location.pathname} className={classes.subLinks}  description={navData.loggedOut?.games["33"] + " games"}/>
                        </Link>

                        <Link href='/console/11' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Master System' active={'/console/11' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["11"] + " games"}/>
                        </Link>

                        <Link href='/console/15' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Game Gear' active={'/console/15' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["15"] + " games"}/>
                        </Link>

                        <Link href='/console/1' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Mega Drive' active={'/console/1' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["1"] + " games"}/>
                        </Link>

                        <Link href='/console/9' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega CD' active={'/console/9' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["9"] + " games"}/>
                        </Link>

                        <Link href='/console/10' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega 32X' active={'/console/10' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["10"] + " games"}/>
                        </Link>

                        <Link href='/console/39' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega Saturn' active={'/console/39' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["39"] + " games"}/>
                        </Link>

                        <Link href='/console/40' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Sega Dreamcast' active={'/console/40' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["40"] + " games"}/>
                        </Link>
                    </NavLink>

                    <NavLink label='Other' className={classes.mainLinks}>
                        <Link href='/console/43' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='3DO Interactive Multiplayer' active={'/console/43' === window.location.pathname} className={classes.subLinks}  description={navData.loggedOut?.games["43"] + " games"}/>
                        </Link>

                        <Link href='/console/37' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Amstrad CPC' active={'/console/37' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["37"] + " games"}/>
                        </Link>

                        <Link href='/console/38' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Apple II' active={'/console/38' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["38"] + " games"}/>
                        </Link>

                        <Link href='/console/27' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Arcade' active={'/console/27' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["27"] + " games"}/>
                        </Link>

                        <Link href='/console/71' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Arduboy' active={'/console/71' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["71"] + " games"}/>
                        </Link>

                        <Link href='/console/44' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='ColecoVision' active={'/console/44' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["44"] + " games"}/>
                        </Link>

                        <Link href='/console/57' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Fairchild Channel F' active={'/console/57' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["57"] + " games"}/>
                        </Link>

                        <Link href='/console/45' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Intellivision' active={'/console/45' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["45"] + " games"}/>
                        </Link>

                        <Link href='/console/23' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Magnavox Odyssey 2' active={'/console/23' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["23"] + " games"}/>
                        </Link>

                        <Link href='/console/69' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Mega Duck' active={'/console/69' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["69"] + " games"}/>
                        </Link>

                        <Link href='/console/29' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='MSX' active={'/console/29' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["29"] + " games"}/>
                        </Link>

                        <Link href='/console/14' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Neo Geo Pocket' active={'/console/14' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["14"] + " games"}/>
                        </Link>

                        <Link href='/console/46' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Vectrex' active={'/console/46' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["46"] + " games"}/>
                        </Link>

                        <Link href='/console/72' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='WASM-4' active={'/console/72' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["72"] + " games"}/>
                        </Link>

                        <Link href='/console/63' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='Watara Supervision' active={'/console/63' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["63"] + " games"}/>
                        </Link>

                        <Link href='/console/53' passHref style={{ textDecoration: 'none' }}>
                            <NavLink label='WonderSwan'active={'/console/53' === window.location.pathname} className={classes.subLinks} description={navData.loggedOut?.games["53"] + " games"}/>
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

    return null;
}

export default Navigation;