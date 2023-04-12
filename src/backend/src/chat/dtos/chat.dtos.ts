export class UserChannelsMessagesDto {
    id: number;
    name: string;
    channels: ChannelMessagesDto[];
}

export class ChannelMessagesDto {
    id: number;
    messages: MessageDto[];
    // groupProfile: string | GroupProfileDto;
}

export class MessageDto {
    id: number;
    sender: number;
    senderName: string;
    channel: number;
    text: string;
    // timestamp: Date;
}

export class GroupProfileDto {
    owner: number;
    name: string;
    admin: [userId: number];
    blocker: [userId: number];
    channelId: number;
}

export class JoinRoomDto {
    userId: number;
    userName: string;
    channelId: number;
}

export class CreateDmChannelDto {
    userId: number;
    invitee: string;
}

export class returnDmChannelDto {
    channelId: number;
    newInviteeId: number;
}
