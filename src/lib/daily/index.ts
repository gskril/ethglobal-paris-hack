import axios, { AxiosError, AxiosInstance } from 'axios'
import { BadRequestException } from 'next-api-decorators'

import {
  DailyRoom,
  DailyRoomPrivacy,
  DailyRoomProperties,
} from '@/lib/daily/interfaces'

export class DailyHelper {
  axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.daily.co/v1/',
      headers: {
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
    })
  }

  async getRoom(roomId: string): Promise<DailyRoom> {
    const response = await this.axiosInstance.get<DailyRoom>(`/rooms/${roomId}`)
    return response.data
  }

  async getRooms(limit = 5): Promise<DailyRoom[]> {
    const response = await this.axiosInstance.get<DailyRoom[]>(
      `/rooms?limit=${limit}`
    )
    return response.data
  }

  async createRoom(
    name: string,
    privacy: DailyRoomPrivacy,
    properties: DailyRoomProperties
  ): Promise<DailyRoom> {
    try {
      const response = await this.axiosInstance.post<
        {
          name: string
          privacy: DailyRoomPrivacy
          properties: DailyRoomProperties
        },
        { data: DailyRoom }
      >(`/rooms`, {
        name,
        privacy,
        properties,
      })
      return response.data
    } catch (e) {
      const error = e as AxiosError
      throw new BadRequestException(
        (error.response?.data as any)?.info as string
      )
    }
  }

  async deleteRoom(roomName: string): Promise<{
    deleted: boolean
    name: string
  }> {
    try {
      const response = await this.axiosInstance.delete<{
        deleted: boolean
        name: string
      }>(`/rooms/${roomName}`)
      return response.data
    } catch (e) {
      const error = e as AxiosError
      throw new BadRequestException(
        (error.response?.data as any)?.info as string
      )
    }
  }
}
