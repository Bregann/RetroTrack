'use client'

import { Accordion, List, Modal, Text } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { LATEST_VERSION, releaseNotes } from './releaseNotes'

interface UpdateInfoModalProps {
  opened: boolean
  onClose: () => void
}

/**
 * Release notes and support links.
 *
 * The notes themselves live in ./releaseNotes as data - this component only
 * renders them, so publishing a release means editing that array rather than
 * adding another 10 lines of JSX here.
 */
export function UpdateInfoModal({ opened, onClose }: UpdateInfoModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="RetroTrack Updates">
      <Accordion
        multiple
        variant="contained"
        radius="md"
        defaultValue={[LATEST_VERSION]}
        chevron={<IconChevronRight size={16} />}
      >
        {releaseNotes.map((release) => (
          <Accordion.Item value={release.version} key={release.version}>
            <Accordion.Control>{release.title}</Accordion.Control>
            <Accordion.Panel>
              {release.intro !== undefined && (
                <Text mb="sm">{release.intro}</Text>
              )}

              <List withPadding>
                {release.items.map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>

              {release.notes?.map((note) => (
                <Text mt="md" key={note}>{note}</Text>
              ))}

              {release.upcoming !== undefined && (
                <>
                  <Text mt="md">{release.upcomingLabel}</Text>
                  <List withPadding>
                    {release.upcoming.map((item) => (
                      <List.Item key={item}>{item}</List.Item>
                    ))}
                  </List>
                </>
              )}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>

      <Text fw={'bold'} mt="md" size='xl'>Need help?</Text>
      <Text mt="xs">
        If you have any feedback or suggestions or bug reports, please let me know on either Discord
        (my username is <b>guinea.</b>), GitHub <a href='https://github.com/Bregann/RetroTrack' target='_blank' rel='noreferrer'>here</a>{' '}
        or on RetroAchievements <a href='https://retroachievements.org/user/guinea' target='_blank' rel='noreferrer'>here</a>!
      </Text>
    </Modal>
  )
}
