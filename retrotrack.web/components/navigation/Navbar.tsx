import { NavLink, ScrollArea, Stack, ThemeIcon, Text, Divider, Badge, Group } from '@mantine/core'
import classes from '@/css/components/navbar.module.scss'

export function Navbar() {
  return (
    <nav className={classes.navbar}>
      <ScrollArea className={classes.links}>
        <NavLink
          label="Nintendo"
          py="xs"
          childrenOffset={10}
        >
          <NavLink
            label="Game Boy"
            py="xs"
            description={
              <Stack gap={4} mt={4}>
                <Text size="sm" c="dimmed">
                  1104 games
                </Text>
                <Group gap="xs">
                  <Badge color="teal" variant="light" size="sm">
                    beaten
                  </Badge>
                  <Text size="sm">1444/1104 (0.36%)</Text>
                </Group>
                <Group gap="xs">
                  <Badge color="cyan" variant="light" size="sm">
                    softcore
                  </Badge>
                  <Text size="sm">1444/1104 (0.36%)</Text>
                </Group>
                <Group gap="sm">
                  <Badge color="orange" variant="light" size="sm">
                    completed
                  </Badge>
                  <Text size="sm">1344/1104 (0.27%)</Text>
                </Group>
                <Group gap="sm">
                  <Badge color="yellow" variant="light" size="sm">
                    mastered
                  </Badge>
                  <Text size="sm">1344/1104 (0.27%)</Text>
                </Group>
              </Stack>
            }
          />
          <Divider my="sm" />
        </NavLink>
      </ScrollArea>
    </nav>
  )
}
