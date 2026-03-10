export const checkWebsite = async (url: string) => {
  const start = Date.now()

  try {
    await fetch(url, { mode: "no-cors" })
    const latency = Date.now() - start

    return {
      status: "UP",
      latency,
    }
  } catch {
    return {
      status: "DOWN",
      latency: 0,
    }
  }
}