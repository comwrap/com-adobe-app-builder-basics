const { Core } = require('@adobe/aio-sdk')
const stateLib = require('@adobe/aio-lib-state')
const stateFiles = require('@adobe/aio-lib-files')

const { v4: uuidv4 } = require('uuid')

async function main(params) {
  const logger = Core.Logger('save-user')
  
  try {
    // Get name and active from params
    const { name, active, avatar, avatarFileName } = params
    
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
      active: active || 'Yes',
      avatarUrl: null
    }

    // Handle avatar upload if provided
    if (avatar) {
      try {
        // Initialize file storage
        const files = await stateFiles.init()
        
        // Determine file extension from filename or default to jpg
        let extension = 'jpg'
        if (avatarFileName) {
          const ext = avatarFileName.split('.').pop().toLowerCase()
          if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
            extension = ext === 'jpeg' ? 'jpg' : ext
          }
        }
        
        // Create file path in public folder for accessibility
        const avatarPath = `public/avatars/${id}.${extension}`
        
        // Decode base64 avatar and write to file storage
        const avatarBuffer = Buffer.from(avatar, 'base64')
        await files.write(avatarPath, avatarBuffer)
        
        // Get the public URL for the avatar
        const props = await files.getProperties(avatarPath)
        userData.avatarUrl = props.url
        
        logger.info(`Saved avatar: ${avatarPath}`)
      } catch (fileError) {
        logger.error('Error saving avatar:', fileError)
        // Continue without avatar if file storage fails
      }
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
