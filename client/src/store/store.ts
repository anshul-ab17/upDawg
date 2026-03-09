import { configureStore } from "@reduxjs/toolkit"
import siteReducer from "./siteSlice"

export const store = configureStore({
  reducer: {
    sites: siteReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch