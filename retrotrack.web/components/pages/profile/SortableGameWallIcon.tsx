'use client'

import { Box } from '@mantine/core'
import Image from 'next/image'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styles from '@/css/pages/profile.module.scss'

interface SortableGameWallIconProps {
  id: number
  icon: string
  title: string
  isHardcore: boolean
}

/**
 * A draggable tile in an editable game wall.
 *
 * Previously declared inside UserProfileComponent's body, which meant a fresh
 * component type on every render - React would unmount and remount every tile
 * whenever the profile re-rendered, discarding drag state mid-interaction.
 */
export function SortableGameWallIcon({ id, icon, title, isHardcore }: SortableGameWallIconProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.8 : 1,
    width: 64,
    height: 64
  }

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Image
        src={`https://media.retroachievements.org${icon}`}
        alt={title}
        width={64}
        height={64}
        className={`${styles.wallIcon} ${isHardcore ? styles.hardcoreBorder : ''}`}
      />
    </Box>
  )
}
