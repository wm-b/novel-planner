import { InputHTMLAttributes } from "react"
import crosscircle from "assets/icons/crosscircle.svg"
import s from "./TextCard.module.scss"
import { useData } from "hooks/DataContext"

export const TextCard = ({
  containerProps,
  titleProps,
  textProps,
  remove
}: {
  containerProps?: InputHTMLAttributes<HTMLDivElement>
  titleProps?: InputHTMLAttributes<HTMLTextAreaElement>
  textProps?: InputHTMLAttributes<HTMLTextAreaElement>
  remove?: () => void
}) => {
  const { data } = useData()

  const { className: containerClassName, ...containerRest } =
    containerProps ?? { className: "" }

  return (
    <article
      className={`${s.container} ${containerClassName}`}
      {...containerRest}
    >
      <div className={s.header}>
        <textarea {...titleProps} rows={1} />
        {data.textcards.length > 1 && (
          <button className={s.remove} onClick={remove}>
            <img alt="remove card button" src={crosscircle} />
          </button>
        )}
      </div>

      <div className={s.growWrap}>
        <textarea {...textProps} data-replicated-value={textProps?.value} rows={5} />
      </div>
    </article>
  )
}
