import type { AxiosResponse } from "axios"

const filenameFrom = (disposition: string | undefined, fallback: string) =>
  disposition?.match(/filename="([^"]+)"/)?.[1] ?? fallback

/** Saves a blob response under the name the API gave it. */
export const saveBlobResponse = (response: AxiosResponse<Blob>, fallback: string) => {
  const url = URL.createObjectURL(response.data)
  const link = document.createElement("a")
  link.href = url
  link.download = filenameFrom(response.headers["content-disposition"], fallback)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
