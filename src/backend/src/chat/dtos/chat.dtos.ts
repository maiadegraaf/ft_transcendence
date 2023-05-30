import { IsInt } from 'class-validator'

export class MessageDto {
    @IsInt()
    id: number
    sender: {
        id: number
        login: string
    }
    @IsInt()
    channel: number
    text: string
}

export class JoinRoomDto {
    userName: string
    @IsInt()
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
    @IsInt()
    groupId: number
    @IsInt()
    channelId: number
}

export class JoinGroupProtectedDto {
    userName: string
    @IsInt()
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
