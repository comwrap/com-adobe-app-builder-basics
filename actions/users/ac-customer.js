const stateLib = require('@adobe/aio-lib-state')

async function main(params) {
  
  try {

    // Extract customer data from the event payload
    const { data } = params
    
    if (!data || !data.value) {
      return {
        statusCode: 400,
        body: { error: 'No customer data in event payload' }
      }
    }

    const { firstname, lastname, id } = data.value
    
    if (!id) {
      return {
        statusCode: 400,
        body: { error: 'Customer ID is required' }
      }
    }

    // Use Adobe Commerce customer ID as our key
    const key = `user_ac_${id}`
    
    // Combine firstname and lastname for the name field
    const name = `${firstname || ''} ${lastname || ''}`.trim()
    
    // User data to store (matching existing user structure)
    const userData = {
      id: `ac_${id}`, // Prefix with ac_ to identify Adobe Commerce customers
      name,
      active: 'Yes',
      source: 'adobe_commerce',
      commerceCustomerId: id,
      metadata: data._metadata || {}
    }

    // Initialize state storage
    const state = await stateLib.init()
    
    // Save to state storage 
    await state.put(key, JSON.stringify(userData), { ttl: stateLib.MAX_TTL })
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: { 
        success: true, 
        message: 'Customer saved successfully',
        user: userData 
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: { error: error.message }
    }
  }
}

exports.main = main
