import "./App.scss"
import { DefaultLayout } from "layouts"
import { Home } from "pages"
import { DataProvider } from "contexts"

const CurrentPage = () => {
  switch (true) {
    default:
      return <Home />
  }
}

export const App = () => {
  return (
    <DataProvider>
      <DefaultLayout>
        <CurrentPage />
      </DefaultLayout>
    </DataProvider>
  )
}
