import s from "./Dim.module.scss"

export const Dim = ({
  dim,
  setDim
}: {
  dim: boolean
  setDim: (dim: boolean) => void
}) => (
  <template
    className={`${s.dim} ${dim ? s.visible : ""}`}
    onClick={() => setDim(false)}
  />
)
