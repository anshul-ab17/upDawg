import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { api } from "@/lib/api"

export type Website = {
  id: string
  url: string
  status?: boolean | null
  latency?: number | null
}

export const fetchWebsites = createAsyncThunk("websites/fetch", async () => {
  const res = await api.get<Website[]>("/website")
  return res.data
})

export const createWebsite = createAsyncThunk("websites/create", async (url: string, { rejectWithValue }) => {
  try {
    const res = await api.post<{ id: string }>("/website", { url })
    return { id: res.data.id, url }
  } catch (err: any) {
    return rejectWithValue(err.response?.status ?? "error")
  }
})

const websiteSlice = createSlice({
  name: "websites",
  initialState: [] as Website[],
  reducers: {
    setWebsites: (_, action: PayloadAction<Website[]>) => action.payload,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebsites.fulfilled, (_, action) => action.payload)
      .addCase(createWebsite.fulfilled, (state, action) => {
        state.push(action.payload)
      })
  },
})

export const { setWebsites } = websiteSlice.actions
export default websiteSlice.reducer
