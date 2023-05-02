export interface IChannels {
  id: number
  messages: IMessage[]
  profile: IProfile | null
  name: string
}

export interface IMessage {
  id: number
  text: string
  sender: {
    id: number
    login: string
  }
  channel: number // kan denk ik weg
}

export interface IProfile {
    name: string
    id: number
}
