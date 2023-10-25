import { create } from 'zustand'

interface Notification {
  message: string
}

type Store = {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (notification: Notification) => void
}

export const cocinaStore = create<Store>()((set) => ({
  notifications: [],
  addNotification: (notification: Notification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),
  removeNotification: (notification: Notification) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n !== notification),
    })),
}))