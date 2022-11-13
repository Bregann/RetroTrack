'use client';
import { AppShell, Burger, MediaQuery, Navbar, NavLink, Header } from "@mantine/core";
import { use, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { getSession, useSession } from "next-auth/react";


export default function Nav({ children }: { children: React.ReactNode }) {
    const [opened, setOpened] = useState(false);
    const session = use(getSession());
    console.log(session);
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
            <NavLink label='home' component="a" href='/home'/>
            </Navbar>
        }>
        {children}
    </AppShell>
     );
}