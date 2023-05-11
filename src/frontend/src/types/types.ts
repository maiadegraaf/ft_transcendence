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
    owner: IUser
    admin: IUser[]
    muted: IUser[]
    blocked: IUser[]
}

export interface IUser {
    id: number
    login: string
}

export enum EGroupChannelType {
    PRIVATE,
    PUBLIC,
    PROTECTED,
}