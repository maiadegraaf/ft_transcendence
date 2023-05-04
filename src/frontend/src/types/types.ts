export interface IChannels {
  id: number
  messages: IMessage[]
  profile: IProfile | null
  name: string
  users: IUser[]
}

export interface IMessage {
  id: number
  text: string
  sender: IUser
  channel: number // kan denk ik weg
}

export interface IProfile {
    name: string
    id: number
}

export interface IUser {
    id: number
    login: string
}
