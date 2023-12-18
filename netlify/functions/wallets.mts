import process from 'node:process'
import type { Handler, HandlerEvent } from '@netlify/functions'
import { NetlifyJwtVerifier } from '@serverless-jwt/netlify'
import { ManagementClient } from 'auth0'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local', override: true })

const verifyJwt = NetlifyJwtVerifier({
  issuer: `https://${process.env.VITE_AUTH0_DOMAIN}/`,
  audience: process.env.VITE_AUTH0_AUDIENCE || '',
})

const management = new ManagementClient({
  domain: process.env.AUTH0_MANAGEMENT_DOMAIN || '',
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID || '',
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET || '',
})

const handler: Handler = verifyJwt(async (event: HandlerEvent, context) => {
  if (event.httpMethod !== 'PATCH') {
    return {
      statusCode: 405,
    }
  }

  if (!context.identityContext) {
    return {
      statusCode: 403,
    }
  }

  if (!event.body) {
    return {
      statusCode: 400,
    }
  }

  let metadata

  try {
    metadata = JSON.parse(event.body)
  }
  catch {
    return {
      statusCode: 400,
    }
  }

  if (!metadata.wallet) {
    return {
      statusCode: 400,
    }
  }

  try {
    await management.users.update({ id: context.identityContext.claims.sub }, {
      user_metadata: {
        wallet: metadata.wallet,
      },
    })
  }
  catch {
    return {
      statusCode: 500,
    }
  }

  return {
    statusCode: 204,
  }
})

export { handler }
