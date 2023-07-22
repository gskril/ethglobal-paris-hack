import {
  createHandler,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
} from 'next-api-decorators'
import { JwtAuthGuard } from '@/lib/middlewares'
import type { NextApiRequest } from 'next'
import { getBubbleById } from '@/lib/db/services/bubble'
import { checkBubbleAccess } from '@/pages/api/bubbles/utils'
import { generateDailyJWT } from '@/lib/daily/utils'
import { getUserName } from '@/lib/db/services/user'

export interface BubbleAccessResponseData {
  accessToken: string
}

class BubbleAccessHandler {
  @Post()
  @JwtAuthGuard()
  public async getBubbleToken(@Req() req: NextApiRequest) {
    const { id } = req.query
    const user = req.user!

    const bubble = await getBubbleById(id as string)
    if (!bubble) {
      throw new NotFoundException('Bubble not found')
    }

    const canAccessBubble = await checkBubbleAccess(bubble, req.user!)
    if (!canAccessBubble) {
      throw new UnauthorizedException("You don't have access to this bubble")
    }
    return {
      accessToken: generateDailyJWT(bubble.slug, getUserName(user)),
    }
  }
}

export default createHandler(BubbleAccessHandler)
