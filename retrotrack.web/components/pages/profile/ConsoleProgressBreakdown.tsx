'use client'

import { Accordion, Divider, SimpleGrid, Text } from '@mantine/core'
import styles from '@/css/pages/profile.module.scss'
import { ConsoleType } from '@/enums/consoleType'
import { ConsoleProgressDatum } from '@/interfaces/api/users/GetUserProfileResponse'
import { ConsoleProgressCard } from './ConsoleProgressCard'

interface ConsoleProgressBreakdownProps {
  consoleProgressData: ConsoleProgressDatum[]
  columns: number
}

const consoleTypes = [
  ConsoleType.Nintendo,
  ConsoleType.Sony,
  ConsoleType.Atari,
  ConsoleType.Sega,
  ConsoleType.NEC,
  ConsoleType.SNK,
  ConsoleType.Other
]

/** Per-manufacturer accordion of console progress cards. */
export function ConsoleProgressBreakdown({
  consoleProgressData,
  columns
}: ConsoleProgressBreakdownProps) {
  return (
    <>
      <Divider
        label="Console Progress Breakdown"
        labelPosition="center"
        mb="md"
        classNames={{ label: styles.dividerText }}
      />
      <Accordion>
        {consoleTypes.map((consoleType) => (
          <Accordion.Item value={ConsoleType[consoleType]} key={consoleType}>
            <Accordion.Control>
              <Text fw={600}>{ConsoleType[consoleType]}</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <SimpleGrid cols={columns} spacing="lg" mb="xl">
                {consoleProgressData
                  .filter((x) => x.consoleType === consoleType)
                  .map((consoleData) => (
                    <ConsoleProgressCard key={consoleData.consoleId} consoleData={consoleData} />
                  ))}
              </SimpleGrid>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  )
}
