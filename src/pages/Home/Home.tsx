import { useData } from "hooks"
import { TextCard } from "components"
import { useRef, MouseEventHandler, useState } from "react"
import { Guid } from "utilities/data"
import burger from "assets/icons/burger.svg"
import s from "./Home.module.scss"

export const Home = () => {
  const {
    data,
    addTextCard,
    insertBeforeTextCard,
    insertAfterTextCard,
    removeTextCard,
    updateTextCard,
    moveTextCardByGuid,
    createNewConnection,
    importData,
    exportData
  } = useData()

  const [draggingData, setDraggingData] = useState<{
    id: Guid
    cursorOffset: number
  } | null>(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const [newConnectionFrom, setNewConnectionFrom] = useState<Guid>()

  const handleNewConnection = (id: Guid) => {
    if (!newConnectionFrom) {
      setNewConnectionFrom(id)
      return
    }

    if (newConnectionFrom === id) {
      setNewConnectionFrom(undefined)
      return
    }

    createNewConnection(newConnectionFrom, id)
    setNewConnectionFrom(undefined)
  }

  const draggingCopy = useRef<HTMLDivElement | null>(null)

  const createCopyUnderCursor: MouseEventHandler<HTMLDivElement> = (e) => {
    draggingCopy.current = e.currentTarget.cloneNode(true) as HTMLDivElement
    draggingCopy.current.style.position = "fixed"
    draggingCopy.current.style.left = `${
      e.clientX - (e.clientX - e.currentTarget.getBoundingClientRect().left)
    }px`
    draggingCopy.current.style.top = `${
      e.clientY - (e.clientY - e.currentTarget.getBoundingClientRect().top)
    }px`
    draggingCopy.current.style.opacity = "1"
    draggingCopy.current.style.pointerEvents = "none"
    document.body.appendChild(draggingCopy.current)
  }

  const removeCopyUnderCursor = () => {
    if (!draggingCopy.current) return
    document.body.removeChild(draggingCopy.current)
    draggingCopy.current = null
  }

  const moveCopyWithCursor = (x: number, y: number) => {
    if (!draggingCopy.current || !draggingData || (x === 0 && y === 0)) return
    draggingCopy.current.style.top = `${y - draggingData.cursorOffset}px`
  }

  return (
    <div className={s.container}>
      <button className={s.burger} onClick={() => setMenuOpen(true)}>
        <img alt="Menu" src={burger} />
      </button>

      <aside className={`${s.menu} ${menuOpen ? s.open : ""}`}>
        <button
          className={s.menuButton}
          onClick={() => {
            importData()
            setMenuOpen(false)
          }}
        >
          Import Data
        </button>
        <button
          className={s.menuButton}
          onClick={() => {
            exportData()
            setMenuOpen(false)
          }}
        >
          Export Data
        </button>
      </aside>

      <template
        className={`${s.dim} ${menuOpen ? s.visible : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {data.textcards.map((tc) => (
        <TextCard
          key={tc.id}
          containerProps={{
            onDragStart: (e) => {
              e.currentTarget.style.opacity = "0"
              setDraggingData({
                id: tc.id,
                cursorOffset:
                  e.clientY - e.currentTarget.getBoundingClientRect().top
              })
              createCopyUnderCursor(e)
            },
            onDrag: (e) => {
              moveCopyWithCursor(e.clientX, e.clientY)
            },
            onDragEnd: (e) => {
              removeCopyUnderCursor()
              setDraggingData(null)
              e.currentTarget.style.opacity = "unset"
            },
            onDragOver: (e) => {
              if (
                !draggingData ||
                !draggingCopy.current ||
                e.clientY <
                  e.currentTarget.getBoundingClientRect().bottom -
                    (draggingCopy.current.getBoundingClientRect().height + 20)
              )
                return

              moveTextCardByGuid(draggingData.id, tc.id)
              e.preventDefault()
            },
            draggable: true
          }}
          titleProps={{
            value: tc.title,
            onChange: (e) => updateTextCard(tc.id, e.target.value, "title")
          }}
          textProps={{
            value: tc.text,
            onChange: (e) => updateTextCard(tc.id, e.target.value, "text")
          }}
          newConnection={() => handleNewConnection(tc.id)}
          connectionIconHighlighted={newConnectionFrom === tc.id}
          insertBefore={() => insertBeforeTextCard(tc.id)}
          insertAfter={() => insertAfterTextCard(tc.id)}
          remove={() => removeTextCard(tc.id)}
        />
      ))}

      <button className={s.addNewCard} onClick={addTextCard}>
        Add New Card
      </button>
    </div>
  )
}
