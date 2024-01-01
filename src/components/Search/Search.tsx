import s from "./Search.module.scss"
import searchIcon from "assets/icons/search.svg"

export const Search = ({
  filter,
  setFilter
}: {
  filter: string
  setFilter: (filter: string) => void
}) => (
  <div className={s.container}>
    <img alt="" src={searchIcon} />
    <input
      className={s.search}
      type="text"
      placeholder="Search"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    />
  </div>
)
