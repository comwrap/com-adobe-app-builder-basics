async function main() {
  const extensionId = 'simpleApp';

  return {
    statusCode: 200,
    body: {
        registration: {
            menuItems: [
                {
                    id: `${extensionId}::config`,
                    title: `Configuration`,
                    parent: `${extensionId}::userManagement`,
                    sortOrder: 1,
                },
                {
                    id: `${extensionId}::userManagement`,
                    title: 'User Management',
                    isSection: true,
                    sortOrder: 100
                }
            ],
            page: {
                title: 'User Management',
            }
        }
    }
}
}

exports.main = main;
