import { InputHTMLAttributes, useEffect, useRef } from "react"
import connectionIcon from "assets/icons/connection.svg"
import connectionHighlightedIcon from "assets/icons/connection-highlighted.svg"
import insertBeforeIcon from "assets/icons/insert-before.svg"
import insertAfterIcon from "assets/icons/insert-after.svg"
import closeIcon from "assets/icons/close.svg"
import s from "./TextCard.module.scss"

export const TextCard = ({
  id,
  titleProps,
  textProps,
  newConnection,
  connectionIconHighlighted,
  insertBefore,
  insertAfter,
  remove,
  ...containerProps
}: {
  id: string
  titleProps?: InputHTMLAttributes<HTMLTextAreaElement>
  textProps?: InputHTMLAttributes<HTMLTextAreaElement>
  newConnection?: () => void
  connectionIconHighlighted?: boolean
  insertBefore?: () => void
  insertAfter?: () => void
  remove?: () => void
} & InputHTMLAttributes<HTMLDivElement>) => {
  const { className: containerClassName, ...containerRest } =
    containerProps ?? { className: "" }
  const { onKeyDown: onTitleKeyDown, ...titlePropsRest } = titleProps ?? {
    onTitleKeyDown: undefined
  }

  return (
    <article
      className={`${s.container} ${containerClassName}`}
      {...containerRest}
    >
      <div className={s.top} />

      <div
        className={s.header}
        style={{ display: titleProps?.value ? "flex" : undefined }}
      >
        <textarea
          id={`${id}-title`}
          placeholder="Title"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault()
            onTitleKeyDown?.(e)
          }}
          {...titlePropsRest}
        />

        <div className={s.icons}>
          <button onClick={newConnection}>
            <img
              alt="New Connection"
              src={
                connectionIconHighlighted
                  ? connectionHighlightedIcon
                  : connectionIcon
              }
            />
          </button>

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

      <ExpandingTextArea
        id={`${id}-text`}
        placeholder="Text"
        rows={3}
        {...textProps}
      />
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
