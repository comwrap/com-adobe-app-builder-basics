const { Core } = require('@adobe/aio-sdk')
const stateLib = require('@adobe/aio-lib-state')
const { v4: uuidv4 } = require('uuid')

async function main(params) {
  const logger = Core.Logger('save-user')
  
  try {
    // Get name and active from params
    const { name, active } = params
    
    if (!name) {
      return {
        statusCode: 400,
        body: { error: 'Name is required' }
      }
    }

    // Generate UUID for the user
    const id = uuidv4()
    const key = `user_${id}`
    
    // User data to store
    const userData = {
      id,
      name,
      active: active || 'Yes'
    }

    // Initialize state storage
    const state = await stateLib.init()
    
    // Save to state storage 
    await state.put(key, JSON.stringify(userData), { ttl: stateLib.MAX_TTL })
    
    logger.info(`Saved user: ${key}`)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: userData
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
