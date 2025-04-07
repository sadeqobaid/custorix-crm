import { configureStore } from '@reduxjs/toolkit'

// We'll add reducers as we implement features
export const store = configureStore({
  reducer: {
    // Add reducers here
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
