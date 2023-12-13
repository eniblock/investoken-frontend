import process from 'node:process'
import type { HandlerContext, HandlerEvent } from '@netlify/functions'
import { NetlifyJwtVerifier } from '@serverless-jwt/netlify'
import type { GetUsers200ResponseOneOfInner } from 'auth0'
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

const handler = verifyJwt(async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
    }
  }

  if (!context.clientContext) {
    return {
      statusCode: 403,
    }
  }

  let users: GetUsers200ResponseOneOfInner[] = []

  try {
    users = (await management.users.getAll({
      fields: 'user_id,given_name,family_name,email,user_metadata',
    })).data
  }
  catch {
    return {
      statusCode: 500,
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(users),
  }
})

export { handler }
