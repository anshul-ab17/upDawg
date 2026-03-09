import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "@/lib/api"

export interface Site {
  id?: string
  url: string
  status?: string
  latency?: number
}

interface SiteState {
  sites: Site[]
  loading: boolean
}

const initialState: SiteState = {
  sites: [],
  loading: false,
}

export const fetchSites = createAsyncThunk(
  "sites/fetchSites",
  async () => {
    const res = await api.get("/sites")
    return res.data
  }
)

export const addSite = createAsyncThunk(
  "sites/addSite",
  async (url: string) => {
    const res = await api.post("/sites", { url })
    return res.data
  }
)

const siteSlice = createSlice({
  name: "sites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.sites = action.payload
      })
      .addCase(addSite.fulfilled, (state, action) => {
        state.sites.push(action.payload)
      })
  },
})

export default siteSlice.reducer