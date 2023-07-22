export enum DailyRoomPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum DailyRoomSendPermission {
  VIDEO = 'video',
  AUDIO = 'audio',
  SCREEN_VIDEO = 'screenVideo',
  SCREEN_AUDIO = 'screenAudio',
}

export type DailyRoomGeo =
  | 'af-south-1'
  | 'ap-northeast-2'
  | 'ap-southeast-1'
  | 'ap-southeast-2'
  | 'ap-south-1'
  | 'eu-central-1'
  | 'eu-west-2'
  | 'sa-east-1'
  | 'us-east-1'
  | 'us-west-2'

export type DailyRoomLang =
  | 'de'
  | 'en'
  | 'es'
  | 'fi'
  | 'fr'
  | 'it'
  | 'jp'
  | 'ka'
  | 'nl'
  | 'no'
  | 'pt'
  | 'pl'
  | 'ru'
  | 'sv'
  | 'tr'
  | 'user'

export interface DailyRoomProperties {
  nbf?: number
  exp?: number
  max_participants?: number
  enable_people_ui?: boolean
  enable_pip_ui?: boolean
  enable_emoji_reactions?: boolean
  enable_hand_raising?: boolean
  enable_prejoin_ui?: boolean
  enable_network_ui?: boolean
  enable_noise_cancellation_ui?: boolean
  enable_breakout_rooms?: boolean
  enable_knocking?: boolean
  enable_screenshare?: boolean
  enable_video_processing_ui?: boolean
  enable_chat?: boolean
  start_video_off?: boolean
  start_audio_off?: boolean
  owner_only_broadcast?: boolean
  enable_recording?: boolean
  eject_at_room_exp?: boolean
  eject_after_elapsed?: number
  enable_advanced_chat?: boolean
  enable_hidden_participants?: boolean
  enable_mesh_sfu?: boolean
  sfu_switchover?: number
  experimental_optimize_large_calls?: boolean
  lang?: DailyRoomLang
  meeting_join_hook?: string
  signaling_imp?: string
  geo?: DailyRoomGeo
  enable_terse_logging?: boolean
  permissions?: {
    hasPresence: boolean
    canSend: boolean | DailyRoomSendPermission[]
  }
}

export interface DailyRoom {
  id: string
  name: string
  api_created: boolean
  privacy: DailyRoomPrivacy
  url: string
  created_at: string
  config: DailyRoomProperties
}
