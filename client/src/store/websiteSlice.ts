import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Website = {
  id?: string
  url: string
  status?: "UP" | "DOWN"
  latency?: number
}

const initialState: Website[] = []

const websiteSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {
    addWebsite: (state, action: PayloadAction<Website>) => {
      state.push(action.payload)
    },
    setWebsites: (state, action: PayloadAction<Website[]>) => {
      return action.payload
    },
  },
})

export const { addWebsite, setWebsites } = websiteSlice.actions
export default websiteSlice.reducer