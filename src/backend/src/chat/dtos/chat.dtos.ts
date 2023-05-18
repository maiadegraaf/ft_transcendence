export class UserChannelsMessagesDto {
    id: number
    name: string
    channels: ChannelMessagesDto[]
}

export class ChannelMessagesDto {
    id: number
    messages: MessageDto[]
    name: string
    groupProfile: GroupProfileDto
}

export class MessageDto {
    id: number
    sender: {
        id: number
        login: string
    }
    channel: number
    text: string
    // timestamp: Date;
}

export class GroupProfileDto {
    name: string
    channelId: number
    owner: number
    admin: [userId: number]
    blocker: [userId: number]
}

export class JoinRoomDto {
    userId: number
    userName: string
    channelId: number
    channelName: string
}

export class CreateDmChannelDto {
    userId: number
    invitee: string
}

export class CreateGroupChannelDto {
    userId: number
    groupName: string
    type: EGroupChannelType
    password?: string
}

export class addUserToChanelDto {
    userName: string
    channelId: number
}

export class GroupUserProfileUpdateDto {
    userId: number
    userName: string
    groupId: number
    channelId: number
}

export class JoinGroupProtectedDto {
    userId: number
    userName: string
    groupId: number
    password: string
}

export class JoinGroupDto {
    userId: number
    groupName: string
}

export enum EGroupChannelType {
    PRIVATE,
    PUBLIC,
    PROTECTED
}
