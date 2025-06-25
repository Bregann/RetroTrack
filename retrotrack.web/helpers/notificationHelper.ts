'use client'

import { notifications } from '@mantine/notifications'
import { type ReactNode } from 'react'

class notificationHelper {
  public static showSuccessNotification = (notificationTitle: string, notificationMessage: string, closeTime: number, i: ReactNode): void => {
    notifications.show({
      withBorder: true,
      title: notificationTitle,
      message: notificationMessage,
      color: 'green',
      icon: i,
      autoClose: closeTime
    })
  }

  public static showErrorNotification = (notificationTitle: string, notificationMessage: string, closeTime: number, i: ReactNode): void => {
    notifications.show({
      withBorder: true,
      title: notificationTitle,
      message: notificationMessage,
      color: 'red',
      icon: i,
      autoClose: closeTime
    })
  }
}

export default notificationHelper
