import s from "./DefaultLayout.module.scss"
import { ReactNode } from "react"

export const DefaultLayout = ({ children }: { children: ReactNode }) => (
  <main className={s.container}>{children}</main>
)
