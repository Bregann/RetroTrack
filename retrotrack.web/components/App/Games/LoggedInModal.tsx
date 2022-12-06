import { Autocomplete, Button, Container, Footer, Grid, Group, Modal, Switch, Text } from "@mantine/core";
import { useState } from "react";
import Image from 'next/image'
import { GetSpecificGameInfo } from "../../../types/Api/Games/GetSpecificGameInfo";

type LoggedOutModalProps = {
    recentGames: GetSpecificGameInfo
    loggedOutModal: (toggleState: boolean) => void;
}

const LoggedInModal = (props: LoggedOutModalProps) => {

    return ( 
        <>
        <Modal
          opened={true}
          onClose={() => props.loggedOutModal(false)}
          size="xl"
        >
            <Text align="center" mt={-50} mb={20} size={40}>{props.recentGames.title}</Text>
            <Grid>
                <Grid.Col xs={6}>
                <Image
                width={256}
                height={256}
                src={"https://s3-eu-west-1.amazonaws.com/i.retroachievements.org"+ props.recentGames.imageBoxArt}
                alt=""
                style={{marginLeft: 'auto', marginRight: 'auto', display: 'block'}}
                />
                </Grid.Col>

                <Grid.Col xs={6}>
                    <Image
                    width={256}
                    height={256}
                    src={"https://s3-eu-west-1.amazonaws.com/i.retroachievements.org"+ props.recentGames.imageInGame}
                    alt=""
                    style={{marginLeft: 'auto', marginRight: 'auto', display: 'block'}}
                    />
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Achievements</Text>
                    <Text align="center">Aeee</Text>
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Genre</Text>
                    <Text align="center">aaaa</Text>
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Console</Text>
                    <Text align="center">aaaa</Text>
                </Grid.Col>

                <Grid.Col md={3} xs={6}>
                    <Text fw={500} align="center">Players</Text>
                    <Text align="center">aaaa</Text>
                </Grid.Col>

                {props.recentGames.achievements.map((achievement) => {
                    return(
                    <>
                        <Image
                            style={{marginRight: 5, marginBottom: 5}}
                            width={48}
                            height={48}
                            objectFit="cover"
                            src={"https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + achievement.badgeName + "_lock.png"}
                            alt=""
                        />
                     </>
                    )
                })}

            </Grid>
            
            <Grid>
                <Grid.Col xs={12}>{/* if mobile width align center */}
                <Group position="center" spacing={0}>
                    <Button mr={5} mt={30}>Update</Button>
                    <Button mr={5} mt={30}>Track Game</Button>
                    <Button mr={5} mt={30}>Game Page</Button>
                    <Button mr={5} mt={30}>Auto Update</Button>
                    <Button mr={5} mt={30}>Hide Complete</Button>
                    <Button mr={5} mt={30}>Toggle view</Button>
                </Group>
                </Grid.Col>

                <Grid.Col xs={6}>
                </Grid.Col>
            </Grid>
        </Modal>
        </>
     );
}
 
export default LoggedInModal;