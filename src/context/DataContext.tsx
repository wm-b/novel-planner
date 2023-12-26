import { Dispatch, SetStateAction, createContext } from "react"
import { Data, initialData } from "utilities/data"

interface DataContextState {
  data: Data
  setData: Dispatch<SetStateAction<Data>>
  updateTextCard: (index: number, value: string, key?: string) => void
  addTextCard: () => void
  removeTextCard: (index: number) => void
}

export const DataContext = createContext<DataContextState>({
  data: initialData,
  setData: () => {},
  updateTextCard: () => {},
  addTextCard: () => {},
  removeTextCard: () => {}
})
