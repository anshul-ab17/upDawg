import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "@/lib/api"

interface Website {
  id?: string
  url: string
}

interface WebsiteState {
  sites: Website[]
}

const initialState: WebsiteState = {
  sites: []
}

export const addWebsite = createAsyncThunk(
  "websites/add",
  async (url: string) => {
    const res = await api.post("/website", { url })
    return res.data ?? { url }
  }
)

const websiteSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addWebsite.fulfilled, (state, action) => {
      state.sites.push(action.payload)
    })
  }
})

export default websiteSlice.reducer