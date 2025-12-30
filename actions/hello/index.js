async function main(params) {
    const name = params.name || 'World';
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: {
        message: `Hello ${name} from Adobe App Builder Action!`,
        timestamp: new Date().toISOString(),
        params
      }
    }
  }
  
  exports.main = main