import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState
} from "react"
import { Data, Guid, TextCard, initialData } from "utilities/data"

interface DataContextState {
  data: Data
  setData: Dispatch<SetStateAction<Data>>
  addTextCard: () => void
  insertBeforeTextCard: (id: Guid) => void
  insertAfterTextCard: (id: Guid) => void
  removeTextCard: (id: Guid) => void
  updateTextCard: (id: Guid, value: string, key?: keyof TextCard) => void
  moveTextCardByIndex: (moving: number, displacing: number) => void
  moveTextCardByGuid: (moving: Guid, replacing: Guid) => void
}

export const DataContext = createContext<DataContextState>({
  data: initialData,
  setData: () => {},
  addTextCard: () => {},
  insertBeforeTextCard: () => {},
  insertAfterTextCard: () => {},
  removeTextCard: () => {},
  updateTextCard: () => {},
  moveTextCardByIndex: () => {},
  moveTextCardByGuid: () => {}
})

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Data>(
    localStorage.getItem("data")
      ? JSON.parse(localStorage.getItem("data")!)
      : initialData
  )

  const setTextCards = (fn: (prev: TextCard[]) => TextCard[]) =>
    setData((prev) => ({ ...prev, textcards: fn(prev.textcards) }))

  const addTextCard = () =>
    setTextCards((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "", text: "" }
    ])

  const insertTextCard = (id: Guid, positionModifier: number) =>
    setTextCards((prev) => [
      ...prev.slice(0, prev.findIndex((tc) => tc.id === id) + positionModifier),
      { id: crypto.randomUUID(), title: "", text: "" },
      ...prev.slice(prev.findIndex((tc) => tc.id === id) + positionModifier)
    ])

  const insertBeforeTextCard = (id: Guid) => insertTextCard(id, 0)

  const insertAfterTextCard = (id: Guid) => insertTextCard(id, 1)

  const removeTextCard = (id: Guid) =>
    setTextCards((prev) => prev.filter((tc) => tc.id !== id))

  const updateTextCard = (
    id: Guid,
    value: string,
    key: keyof TextCard = "text"
  ) =>
    setTextCards((prev) =>
      prev.map((tc) => (tc.id === id ? { ...tc, [key]: value } : tc))
    )

  const moveTextCardByIndex = (moving: number, displacing: number) => {
    if (moving === displacing) return

    const newCards = [...data.textcards]
    newCards.splice(displacing, 0, newCards.splice(moving, 1)[0])

    setData((prev) => ({ ...prev, textcards: newCards }))
  }

  const moveTextCardByGuid = (moving: Guid, displacing: Guid) => {
    const movingIndex = data.textcards.findIndex((tc) => tc.id === moving)
    const displacingIndex = data.textcards.findIndex(
      (tc) => tc.id === displacing
    )

    moveTextCardByIndex(movingIndex, displacingIndex)
  }

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data))
  }, [data])

  console.log(data)

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        addTextCard,
        insertBeforeTextCard,
        insertAfterTextCard,
        removeTextCard,
        updateTextCard,
        moveTextCardByIndex,
        moveTextCardByGuid
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
