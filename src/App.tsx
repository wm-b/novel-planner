import "./App.scss"
import { DefaultLayout } from "layouts/DefaultLayout"
import { Home } from "./pages/Home"
import { DataContext } from "context/DataContext"
import { useEffect, useState } from "react"
import { Data, initialData } from "utilities/data"

const CurrentPage = () => {
  switch (true) {
    default:
      return <Home />
  }
}

export const App = () => {
  const [data, setData] = useState<Data>(
    localStorage.getItem("data")
      ? JSON.parse(localStorage.getItem("data")!)
      : initialData
  )

  const updateTextCard = (index: number, value: string, key: string = "text") =>
    setData((prev) => ({
      ...prev,
      textcards: prev.textcards.map((tc, i) =>
        i === index ? { ...tc, [key]: value } : tc
      )
    }))

  const addTextCard = () =>
    setData((prev) => ({
      ...prev,
      textcards: [...prev.textcards, { title: "", text: "" }]
    }))

  const removeTextCard = (index: number) =>
    setData((prev) => ({
      ...prev,
      textcards: prev.textcards.filter((_, i) => i !== index)
    }))

  console.log(data)

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data))
  }, [data])

  return (
    <DataContext.Provider
      value={{ data, setData, updateTextCard, addTextCard, removeTextCard }}
    >
      <DefaultLayout>
        <CurrentPage />
      </DefaultLayout>
    </DataContext.Provider>
  )
}
