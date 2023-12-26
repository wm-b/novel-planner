import { useData } from "hooks/DataContext"
import { TextCard } from "components/TextCard"
import s from "./Home.module.scss"

export const Home = () => {
  const { data, updateTextCard, addTextCard, removeTextCard } = useData()

  return (
    <div className={s.container}>
      {data.textcards.map((tc, i) => (
        <TextCard
          key={i}
          titleProps={{
            value: tc.title,
            onChange: (e) => updateTextCard(i, e.target.value, "title")
          }}
          textProps={{
            value: tc.text,
            onChange: (e) => updateTextCard(i, e.target.innerHTML, "text")
          }}
          remove={() => removeTextCard(i)}
        />
      ))}

      <button className={s.addTextCard} onClick={addTextCard}>
        Add New Card
      </button>
    </div>
  )
}
