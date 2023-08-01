// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Body,
  createHandler,
  Post,
  Req,
  ValidationPipe,
} from 'next-api-decorators'

import {
  IsArray,
  IsEthereumAddress,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator'
import { Bubble, BubbleConditionType } from '@/lib/db/interfaces/bubble'
import { JwtAuthGuard } from '@/lib/middlewares'
import { DailyHelper } from '@/lib/daily'
import {
  DailyRoomPrivacy,
  DailyRoomSendPermission,
} from '@/lib/daily/interfaces'
import slugify from 'slugify'
import { createBubble } from '@/lib/db/services/bubble'
import type { NextApiRequest } from 'next'
import { Type } from 'class-transformer'
import { enrichBubbleConditions } from '@/pages/api/bubbles/utils'

export type CreateBubbleResponseData = Bubble

export type CreateBubbleRequestData = {
  name: string
  maxParticipants?: number
  farcasterCastHash?: string
  conditions: {
    contractAddress?: string
    tokenId?: string
    amount?: number
    type: BubbleConditionType
    sismoGroupIds?: string[]
    poapEventId?: string
  }[]
}

export class BubbleConditionDTO {
  @IsIn(Object.values(BubbleConditionType))
  type!: BubbleConditionType

  @IsOptional()
  @IsString()
  poapEventId?: string

  @IsOptional()
  @IsEthereumAddress()
  contractAddress?: string

  @IsOptional()
  @IsString()
  tokenId?: string

  @IsOptional()
  @IsNumber()
  amount?: number

  @IsOptional()
  @IsArray()
  sismoGroupIds?: string[]
}

export class CreateBubbleDTO {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsOptional()
  @IsInt()
  @Max(200)
  maxParticipants?: number

  @IsOptional()
  @IsString()
  farcasterCastHash?: string

  @IsOptional()
  @Type(() => BubbleConditionDTO)
  @ValidateNested()
  conditions?: BubbleConditionDTO[]
}

class BubblesHandler {
  @Post('/')
  @JwtAuthGuard()
  public async create(
    @Req() req: NextApiRequest,
    @Body(ValidationPipe) body: CreateBubbleDTO
  ) {
    const { name, farcasterCastHash, conditions, maxParticipants } = body
    const dailyHelper = new DailyHelper()
    const bubbleSlug = slugify(name, { lower: true })
    const enrichedConditions = conditions
      ? await enrichBubbleConditions(conditions)
      : []
    const newBubbleObj = {
      name: name,
      slug: bubbleSlug,
      // map needed to conver BubbleConditionDTO to Object (which is accepted by Firebase)
      conditions: enrichedConditions.map((condition) => ({ ...condition })),
      userId: req.user!.id as string,
      farcasterCastHash,
    } as Bubble
    const newDailyRoom = await dailyHelper.createRoom(
      bubbleSlug,
      conditions?.some(
        (condition) => condition.type === BubbleConditionType.OPEN
      )
        ? DailyRoomPrivacy.PUBLIC
        : DailyRoomPrivacy.PRIVATE,
      {
        start_audio_off: true,
        start_video_off: true,
        eject_at_room_exp: true,
        max_participants: maxParticipants ?? 200,
        permissions: {
          canSend: [DailyRoomSendPermission.AUDIO],
          hasPresence: true,
        },
      }
    )
    const newBubbleId = await createBubble({
      ...newBubbleObj,
      dailyRoomId: newDailyRoom.id,
    })
    return {
      newBubbleId,
      dailyRoomId: newDailyRoom.id,
      ...newBubbleObj,
    }
  }
}

export default createHandler(BubblesHandler)
