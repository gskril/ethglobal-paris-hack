// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Body,
  createHandler,
  Post,
  Req,
  ValidationPipe,
} from 'next-api-decorators'

import {
  IsEthereumAddress,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Bubble, BubblePrivacyType } from '@/lib/db/interfaces/bubble'
import { JwtAuthGuard } from '@/lib/middlewares'
import { DailyHelper } from '@/lib/daily'
import {
  DailyRoomPrivacy,
  DailyRoomSendPermission,
} from '@/lib/daily/interfaces'
import slugify from 'slugify'
import { createBubble } from '@/lib/db/services/bubble'
import type { NextApiRequest } from 'next'
import { cleanObject } from '@/lib/utils'
import { enrichBubble } from '@/pages/api/bubbles/utils'

export type CreateBubbleResponseData = Bubble

export type CreateBubbleRequestData = {
  name: string
  farcasterCastHash?: string
  erc20ContractAddress?: string
  erc721ContractAddress?: string
  erc1155ContractAddress?: string
  erc1155TokenId?: string
  erc20amount?: number
  privacyType: BubblePrivacyType
  sismoGroupId?: string
  poapEventId?: string
}

export class CreateBubbleDTO {
  @IsString()
  name!: string

  @IsIn(Object.values(BubblePrivacyType))
  privacyType!: BubblePrivacyType

  @IsOptional()
  @IsString()
  farcasterCastHash?: string

  @IsOptional()
  @IsString()
  poapEventId?: string

  @IsOptional()
  @IsEthereumAddress()
  erc721ContractAddress?: string

  @IsOptional()
  @IsEthereumAddress()
  erc1155ContractAddress?: string

  @IsOptional()
  @IsString()
  erc1155TokenId?: string

  @IsOptional()
  @IsEthereumAddress()
  erc20ContractAddress?: string

  @IsOptional()
  @IsNumber()
  erc20amount?: number

  @IsOptional()
  @IsString()
  sismoGroupId?: string
}

class BubblesHandler {
  @Post('/')
  @JwtAuthGuard()
  public async create(
    @Req() req: NextApiRequest,
    @Body(ValidationPipe) body: CreateBubbleDTO
  ) {
    const {
      name,
      farcasterCastHash,
      erc20ContractAddress,
      erc721ContractAddress,
      erc1155ContractAddress,
      erc1155TokenId,
      erc20amount,
      privacyType,
      sismoGroupId,
      poapEventId,
    } = body

    const dailyHelper = new DailyHelper()
    const bubbleSlug = slugify(name, { lower: true })
    const newBubbleObj = {
      name: name,
      slug: bubbleSlug,
      privacyType: privacyType,
      userId: req.user!.id as string,
    } as Bubble
    const enrichedBubble = await enrichBubble(privacyType, newBubbleObj, {
      erc1155ContractAddress,
      erc1155TokenId,
      erc20ContractAddress,
      erc20amount,
      erc721ContractAddress,
      farcasterCastHash,
      poapEventId,
      sismoGroupId,
    })
    const newDailyRoom = await dailyHelper.createRoom(
      bubbleSlug,
      privacyType === BubblePrivacyType.OPEN
        ? DailyRoomPrivacy.PUBLIC
        : DailyRoomPrivacy.PRIVATE,
      {
        start_audio_off: true,
        start_video_off: true,
        eject_at_room_exp: true,
        permissions: {
          canSend: [DailyRoomSendPermission.AUDIO],
          hasPresence: true,
        },
      }
    )

    const newBubbleId = await createBubble({
      ...enrichedBubble,
      dailyRoomId: newDailyRoom.id,
    })
    return {
      newBubbleId,
      ...enrichedBubble,
    }
  }
}

export default createHandler(BubblesHandler)
