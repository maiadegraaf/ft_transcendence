import { Session } from 'express-session'

// import type { SessionIncomingMessage } from 'express-session';
// import type { SessionData } from 'express-session';
//
// declare module 'express-session' {
//     interface SessionData {
//         user: {
//             id: number;
//             login: string;
//             email: string;
//             isTwoFactorAuthenticationEnabled: any;
//             twoFactorAuthenticationSecret: any;
//         };
//     }
// }
//
// declare module 'http' {
//     export interface IncomingMessage {
//         session: SessionData;
//     }
// }
//
// declare module 'socket.io' {
//     interface Socket {
//         request: SessionIncomingMessage;
//     }
// }
declare module 'http' {
    interface IncomingMessage {
        session: Session & {
            user: {
                id: number
                login: string
                email: string
                isTwoFactorAuthenticationEnabled: any
                twoFactorAuthenticationSecret: any
            }
        }
    }
}
