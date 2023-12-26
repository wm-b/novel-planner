import { DataContext } from "context/DataContext"
import { useContext } from "react"

export function useData() {
  return useContext(DataContext)
}
