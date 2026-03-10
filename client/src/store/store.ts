import { configureStore } from "@reduxjs/toolkit"
import websiteReducer from "./websiteSlice"
import authReducer from "./authSlice"

export const store = configureStore({
  reducer: {
    websites: websiteReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
