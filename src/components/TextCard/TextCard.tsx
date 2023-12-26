import { InputHTMLAttributes, useEffect, useRef } from "react"
import insertBeforeIcon from "assets/icons/insert-before.svg"
import insertAfterIcon from "assets/icons/insert-after.svg"
import closeIcon from "assets/icons/close.svg"
import s from "./TextCard.module.scss"

export const TextCard = ({
  containerProps,
  titleProps,
  textProps,
  insertBefore,
  insertAfter,
  remove
}: {
  containerProps?: InputHTMLAttributes<HTMLDivElement>
  titleProps?: InputHTMLAttributes<HTMLTextAreaElement>
  textProps?: InputHTMLAttributes<HTMLTextAreaElement>
  insertBefore?: () => void
  insertAfter?: () => void
  remove?: () => void
}) => {
  const { className: containerClassName, ...containerRest } =
    containerProps ?? { className: "" }

  return (
    <article
      className={`${s.container} ${containerClassName}`}
      {...containerRest}
    >
      <div className={s.top} />

      <div className={s.header}>
        <textarea placeholder="Title" rows={1} {...titleProps} />

        <div className={s.icons}>
          <button onClick={insertBefore}>
            <img alt="Insert Before Card" src={insertBeforeIcon} />
          </button>

          <button onClick={insertAfter}>
            <img alt="Insert After Card" src={insertAfterIcon} />
          </button>

          <button onClick={remove}>
            <img alt="Remove Card" src={closeIcon} />
          </button>
        </div>
      </div>

      <ExpandingTextArea placeholder="Text" rows={3} {...textProps} />
    </article>
  )
}

export const ExpandingTextArea = ({
  className,
  rows,
  ...rest
}: { rows: number } & InputHTMLAttributes<HTMLTextAreaElement>) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    if (!textAreaRef.current) return
    textAreaRef.current.style.height = "initial"
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
  }

  useEffect(() => {
    adjustHeight()
  }, [rest.value])

  useEffect(() => {
    setTimeout(adjustHeight, 100)
  }, [])

  return (
    <textarea
      ref={textAreaRef}
      rows={rows}
      className={`${s.expandingTextArea} ${className}`}
      {...rest}
    />
  )
}
