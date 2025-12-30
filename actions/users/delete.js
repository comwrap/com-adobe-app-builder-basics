const { Core } = require('@adobe/aio-sdk')
const stateLib = require('@adobe/aio-lib-state')


async function main(params) {
  const logger = Core.Logger('delete-user')
  
  try {
    const { id } = params
    
    if (!id) {
      return {
        statusCode: 400,
        body: { error: 'User ID is required' }
      }
    }

    const key = `user_${id}`
    
    // Initialize state storage
    const state = await stateLib.init()
    
    // Delete from state storage
    await state.delete(key)
    
    logger.info(`Deleted user: ${key}`)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: { success: true, id }
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
