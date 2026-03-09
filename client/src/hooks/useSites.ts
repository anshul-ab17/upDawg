import useSWR from "swr"
import {api} from "@/lib/api"
import { Site } from "../types/site"

const fetcher = (url: string) => api.get(url).then(res => res.data)

export function useSites() {
  const { data, error, isLoading, mutate } = useSWR<Site[]>(
    "/sites",
    fetcher,
    {
      refreshInterval: 5000,
    }
  )

  return {
    sites: data,
    isLoading,
    error,
    refresh: mutate,
  }
}