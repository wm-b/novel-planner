export type Guid = `${string}-${string}-${string}-${string}-${string}`

export interface Data {
  textcards: TextCard[]
  leftConnections: Connection[]
  rightConnections: Connection[]
  settings: Settings
}

export interface TextCard {
  id: Guid
  title: string
  text: string
}

export interface Connection {
  from: Guid
  to: Guid
  indentation: number
}

export interface Settings {}

export const initialData: Data = {
  textcards: [
    {
      id: crypto.randomUUID(),
      title: "",
      text: ""
    }
  ],
  leftConnections: [],
  rightConnections: [],
  settings: {}
}
