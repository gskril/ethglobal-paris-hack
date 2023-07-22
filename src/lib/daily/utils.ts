import jwt from 'jsonwebtoken'

interface JwtPayload {
  r: string // Room name
  iat: number // Issued at (current time in seconds since the epoch)
  d: string // Domain ID
  user_name: string // User name
  user_id: string
}
export const generateDailyJWT = async (
  roomName: string,
  userId: string,
  userName: string
) => {
  // Replace this with your actual API key and domain_id
  const apiKey = process.env.DAILY_API_KEY as string
  const domainId = process.env.DAILY_DOMAIN_ID as string
  const currentTimeInSeconds = Math.floor(Date.now() / 1000)
  const payload: JwtPayload = {
    r: roomName,
    iat: currentTimeInSeconds,
    d: domainId,
    user_name: userName,
    user_id: userId,
  }

  const options: jwt.SignOptions = {
    algorithm: 'HS256', // HMAC-SHA256 algorithm for signing the token
  }

  // Create the JWT using the API key as the secret
  return jwt.sign(payload, apiKey, options)
}
