import {
  Body,
  createHandler,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  ValidationPipe,
} from 'next-api-decorators'
import { JwtAuthGuard } from '@/lib/middlewares'
import type { NextApiRequest } from 'next'
import { getBubbleById } from '@/lib/db/services/bubble'
import { checkBubbleAccess } from '@/pages/api/bubbles/utils'
import { generateDailyJWT } from '@/lib/daily/utils'
import { getUserName } from '@/lib/db/services/user'
import type { SismoConnectResponse } from '@sismo-core/sismo-connect-server'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'

export interface BubbleAccessResponseData {
  accessToken: string
}

export interface BubbleAccessRequestData {
  sismoResponse?: SismoConnectResponse
}

export class SismoConnectResponseDTO {
  @IsString()
  appId!: string

  @IsString()
  namespace!: string

  @IsString()
  version!: string

  @IsString()
  signedMessage?: string

  @IsArray()
  proofs: any
}

export class BubbleAccessDTO {
  @Type(() => SismoConnectResponseDTO)
  @ValidateNested()
  @IsOptional()
  sismoResponse?: SismoConnectResponse
}

class BubbleAccessHandler {
  @Post()
  @JwtAuthGuard()
  public async getBubbleToken(
    @Req() req: NextApiRequest,
    @Body(ValidationPipe) body: BubbleAccessDTO
  ) {
    const { id } = req.query
    const user = req.user!

    const bubble = await getBubbleById(id as string)
    if (!bubble) {
      throw new NotFoundException('Bubble not found')
    }

    if (bubble.userId === user.id) {
      return generateDailyJWT(bubble.slug, user.id as string, getUserName(user))
    }

    const canAccessBubble = await checkBubbleAccess(
      bubble,
      req.user!,
      body.sismoResponse
    )
    if (!canAccessBubble) {
      throw new UnauthorizedException("You don't have access to this bubble")
    }
    const jwt = generateDailyJWT(
      bubble.slug,
      user.id as string,
      getUserName(user)
    )
    return { accessToken: jwt }
  }
}

export default createHandler(BubbleAccessHandler)
