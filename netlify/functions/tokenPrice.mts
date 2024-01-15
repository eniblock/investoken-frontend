import process from 'node:process'
import type { HandlerEvent } from '@netlify/functions'
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

const handler = verifyJwt(async (event: HandlerEvent, context) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'PATCH') {
    return {
      statusCode: 405,
    }
  }

  if (!context.identityContext) {
    return {
      statusCode: 403,
    }
  }

  let tokenPrice: number

  if (event.httpMethod === 'GET') {
    const client = await management.clients.get({ client_id: process.env.VITE_AUTH0_CLIENT_ID || '' })

    if (client.data.client_metadata.tokenPrice)
      tokenPrice = Number(client.data.client_metadata.tokenPrice)

    else
      tokenPrice = 100

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenPrice),
    }
  }
  else {
    if (!context.identityContext.claims.permissions.includes('write:token')) {
      return {
        statusCode: 403,
      }
    }

    if (!event.body) {
      return {
        statusCode: 400,
      }
    }

    try {
      tokenPrice = JSON.parse(event.body)
    }
    catch {
      return {
        statusCode: 400,
      }
    }

    if (!tokenPrice) {
      return {
        statusCode: 400,
      }
    }

    await management.clients.update({ client_id: process.env.VITE_AUTH0_CLIENT_ID || '' }, { client_metadata: { tokenPrice: tokenPrice.toString() } })

    return {
      statusCode: 204,
    }
  }
})

export { handler }
