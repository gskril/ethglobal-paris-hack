import {
  createHandler,
  Delete,
  Get,
  NotFoundException,
  Param,
  Req,
} from 'next-api-decorators'
import { JwtAuthGuard } from '@/lib/middlewares'
import type { NextApiRequest } from 'next'
import { deleteBubble, getBubbleById } from '@/lib/db/services/bubble'
import { DailyHelper } from '@/lib/daily'

export interface BubbleDeleteResponseData {
  message: string
}

class BubbleHandler {
  @Delete()
  @JwtAuthGuard()
  public async delete(@Req() req: NextApiRequest) {
    const { id } = req.query
    const userId = req.user?.id

    const bubble = await getBubbleById(id as string)
    if (!bubble || bubble.userId !== userId) {
      throw new NotFoundException('Bubble not found')
    }
    const dailyHelper = new DailyHelper()
    await dailyHelper.deleteRoom(bubble.slug)
    await deleteBubble(id as string)
    return {
      message: 'Bubble deleted',
    }
  }
}

export default createHandler(BubbleHandler)
