export class MessageDto {
    id: number
    sender: {
        id: number
        login: string
    }
    channel: number
    text: string
}

export class JoinRoomDto {
    userName: string
    channelId: number
    channelName: string
}

export class CreateDmChannelDto {
    invitee: string
}

export class CreateGroupChannelDto {
    groupName: string
    type: EGroupChannelType
    password?: string
}

export class GroupUserProfileUpdateDto {
    userName: string
    groupId: number
    channelId: number
}

export class JoinGroupProtectedDto {
    userName: string
    groupId: number
    password: string
}

export class JoinGroupDto {
    groupName: string
}

export enum EGroupChannelType {
    PRIVATE,
    PUBLIC,
    PROTECTED
}
