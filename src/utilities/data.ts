export type Guid = `${string}-${string}-${string}-${string}-${string}`

export interface Data {
  textcards: TextCard[]
  connections: Connection[]
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
}

export interface Settings {
  fontSize: number
}

export const initialData: Data = {
  textcards: [
    {
      id: crypto.randomUUID(),
      title: "",
      text: ""
    }
  ],
  connections: [],
  settings: {
    fontSize: 16
  }
}
