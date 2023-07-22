import type { NextApiRequest, NextApiResponse } from 'next'

type RoomData = {
  room: string
  id: string
  userId: string | null
  userName: string | null
  joinTime: string
  duration: number
}

export type GetStatesResponseData = {
  [room: string]: RoomData[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetStatesResponseData>
) {
  const presence = await fetch('https://api.daily.co/v1/presence', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    },
  })

  if (!presence.ok) {
    throw new Error('Failed to fetch presence')
  }

  const json = await presence.json()

  res.status(200).json(json)
}
