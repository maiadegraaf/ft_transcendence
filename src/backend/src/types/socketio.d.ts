import { Session } from 'express-session'

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
