import { NextApiRequest, NextApiResponse } from 'next'
import {
  NextFunction,
  UnauthorizedException,
  createMiddlewareDecorator,
} from 'next-api-decorators'

import { verifyTokenAndGetUser } from '@/pages/api/auth/utils'

export const JwtAuthGuard = createMiddlewareDecorator(
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const authorization = req.headers.authorization
    if (!authorization || !authorization.includes('Bearer ')) {
      throw new UnauthorizedException()
    }
    try {
      const token = authorization.replace('Bearer ', '')
      req.user = await verifyTokenAndGetUser(token)
      next()
    } catch (e) {
      throw new UnauthorizedException('Unauthorized')
    }
    next()
  }
)
