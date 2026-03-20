import { create } from 'zustand'

const GRID = { x: 5, y: 4, z: 5 }
const TOTAL = GRID.x * GRID.y * GRID.z

const initialCubes = Array.from({ length: TOTAL }, (_, i) => ({
  id: i,
  active: false,
}))

export const useStore = create((set, get) => ({
  cubes: initialCubes,
  grid: GRID,
  total: TOTAL,
  activatedCount: 0,

  activateCube: (id) =>
    set((state) => {
      if (state.cubes[id].active) return state
      const cubes = state.cubes.map((c) =>
        c.id === id ? { ...c, active: true } : c
      )
      return { cubes, activatedCount: state.activatedCount + 1 }
    }),

  activateRandom: () => {
    const state = get()
    const inactive = state.cubes.filter((c) => !c.active)
    if (inactive.length === 0) return
    const pick = inactive[Math.floor(Math.random() * inactive.length)]
    state.activateCube(pick.id)
  },

  reset: () =>
    set({ cubes: initialCubes.map((c) => ({ ...c, active: false })), activatedCount: 0 }),
}))
