import s from "./DefaultLayout.module.scss"
import { ReactNode } from "react"

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={s.container}>
      <main>{children}</main>
    </div>
  )
}
