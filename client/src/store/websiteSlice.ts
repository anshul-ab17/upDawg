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

export const removeWebsite = createAsyncThunk("websites/remove", async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/website/${id}`)
    return id
  } catch (err: any) {
    return rejectWithValue(err.response?.status ?? "error")
  }
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
      .addCase(removeWebsite.fulfilled, (state, action) => {
        return state.filter(w => w.id !== action.payload)
      })
  },
})

export const { setWebsites } = websiteSlice.actions
export default websiteSlice.reducer
