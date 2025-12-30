const { Core } = require('@adobe/aio-sdk')
const stateLib = require('@adobe/aio-lib-state')

async function main(params) {
  const logger = Core.Logger('list-users')
  
  try {
    // Initialize state storage
    const state = await stateLib.init()
    
    // Collect all user keys using async iterator
    const allKeys = []
    for await (const { keys } of state.list({ match: 'user_*' })) {
      allKeys.push(...keys)
    }
    
    // Get all user data
    const users = []
    for (const key of allKeys) {
      const res = await state.get(key)
      if (res && res.value) {
        users.push(JSON.parse(res.value))
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: { users }
    }
  } catch (error) {
    logger.error(error)
    return {
      statusCode: 500,
      body: { error: error.message }
    }
  }
}

exports.main = main
