import { ScrollArea } from '@mantine/core'
import classes from '@/css/components/navbar.module.scss'

export function Navbar() {
  return (
    <nav className={classes.navbar}>
      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}></div>
      </ScrollArea>
    </nav>
  )
}
