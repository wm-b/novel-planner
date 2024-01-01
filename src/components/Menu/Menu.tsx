import { Dim } from "components"
import { createPortal } from "react-dom"
import s from "./Menu.module.scss"

export const Menu = ({
  open,
  setOpen,
  buttons
}: {
  open: boolean
  setOpen: (open: boolean) => void
  buttons: { text: string; onClick: () => void }[]
}) => (
  <aside className={`${s.menu} ${open ? s.open : ""}`}>
    {createPortal(<Dim dim={open} setDim={setOpen} />, document.body)}

    {buttons.map(({ text, onClick }) => (
      <button
        key={text}
        className={s.menuButton}
        onClick={() => {
          onClick()
          setOpen(false)
        }}
      >
        {text}
      </button>
    ))}
  </aside>
)
