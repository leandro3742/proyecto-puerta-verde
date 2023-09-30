import { create } from 'zustand'

type Store = {
  showSpinner: boolean
  changeState: () => void
}

const spinnerStore = create<Store>()((set) => ({
  showSpinner: false,
  changeState: () => set((state) => ({ showSpinner: !state.showSpinner })),
}))

export default spinnerStore
