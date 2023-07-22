import { User } from '../db/interfaces/user'

declare module 'next' {
  export interface NextApiRequest {
    id?: string
    requestTime?: Date
    user?: User
  }
}
