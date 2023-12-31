import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState
} from "react"
import { Connection, Data, Guid, TextCard, initialData } from "utilities/data"

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
  createNewConnection: (from: Guid, to: Guid) => void
  importData: () => void
  exportData: () => void
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
  moveTextCardByGuid: () => {},
  createNewConnection: () => {},
  importData: () => {},
  exportData: () => {}
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

  const createNewConnection = (from: Guid, to: Guid) => {
    if (
      [...data.leftConnections, ...data.rightConnections].find(
        (c) => c.from === from && c.to === to
      )
    )
      return

    const getIndex = (id: Guid) =>
      data.textcards.findIndex((tc) => tc.id === id)

    let connections: Connection[]
    let setConnections: (fn: (prev: Connection[]) => Connection[]) => void

    if (getIndex(from) - getIndex(to) < 0) {
      connections = data.leftConnections
      setConnections = (fn: (prev: Connection[]) => Connection[]) =>
        setData((prev) => ({
          ...prev,
          leftConnections: fn(prev.leftConnections)
        }))
    } else {
      connections = data.rightConnections
      setConnections = (fn: (prev: Connection[]) => Connection[]) =>
        setData((prev) => ({
          ...prev,
          rightConnections: fn(prev.rightConnections)
        }))
    }

    // if the new connection's "to" is inside an existing connection and its "from" is inside
    // another different existing connection, return
    if (
      connections.find((c) => getIndex(c.from) < getIndex(from)) &&
      connections.find((c) => getIndex(c.to) > getIndex(to))
    )
      return

    // get any connections that completely contain the new connection
    const getContainingConnections = (from: Guid, to: Guid) => {
      const fromIndex = getIndex(from)
      const toIndex = getIndex(to)

      return connections.filter(
        (c) =>
          getIndex(c.from) < fromIndex &&
          getIndex(c.to) > toIndex &&
          c.from !== from &&
          c.to !== to
      )
    }

    // get any connections that are completely contained by the new connection
    const getContainedConnections = (from: Guid, to: Guid) => {
      const fromIndex = getIndex(from)
      const toIndex = getIndex(to)

      return connections.filter(
        (c) =>
          getIndex(c.from) > fromIndex &&
          getIndex(c.to) < toIndex &&
          c.from !== from &&
          c.to !== to
      )
    }

    // compute the indentation of the new connection based on the number of connections it contains
    // and increase the indentation of any connections that completely contain the new connection
    const containingConnections = getContainingConnections(from, to)
    const containedConnections = getContainedConnections(from, to)
    const indentation =
      containedConnections.sort((a, b) => b.indentation - a.indentation)[0]
        ?.indentation + 1 || 0

    setConnections((prev) =>
      prev
        .map((c) =>
          containingConnections.includes(c)
            ? { ...c, indentation: c.indentation + 1 }
            : c
        )
        .concat({ from, to, indentation })
    )
  }

  const importData = () => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = "application/json"
    fileInput.onchange = () => {
      if (!fileInput.files) return

      const file = fileInput.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        if (!reader.result) return

        const data = JSON.parse(reader.result.toString())
        setData(data)
      }
      reader.readAsText(file)
    }
    fileInput.click()
  }

  const exportData = () => {
    const file = new Blob([JSON.stringify(data)], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(file)
    a.download = "novel-planner-data.json"
    a.click()
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
        moveTextCardByGuid,
        createNewConnection,
        importData,
        exportData
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
