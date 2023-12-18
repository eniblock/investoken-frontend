import process from 'node:process'
import type { HandlerEvent } from '@netlify/functions'
import { NetlifyJwtVerifier } from '@serverless-jwt/netlify'
import type { GetUsers200ResponseOneOf } from 'auth0'
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
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
    }
  }

  if (!context.identityContext) {
    return {
      statusCode: 403,
    }
  }

  if (!context.identityContext.claims.permissions.includes('read:users')) {
    return {
      statusCode: 403,
    }
  }

  let itemsPerPage = 5
  let page = 0
  let sort = 'created_at:-1'

  if (event.queryStringParameters) {
    if (event.queryStringParameters.itemsPerPage)
      itemsPerPage = Number(event.queryStringParameters.itemsPerPage)

    if (event.queryStringParameters.page)
      page = Number(event.queryStringParameters.page) - 1

    if (event.queryStringParameters.sort)
      sort = event.queryStringParameters.sort
  }

  let users: GetUsers200ResponseOneOf

  try {
    users = (await management.users.getAll({
      fields: 'user_id,name,email,user_metadata,created_at',
      per_page: itemsPerPage,
      page,
      sort,
      include_totals: true,
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
