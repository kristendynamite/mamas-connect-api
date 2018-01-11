module.exports = {
  // Secret key for JWT signing and encryption
  'secret': 'super secret passphrase',
  // Database connection information
  'database': 'mongodb://localhost:27017/mamasconnect',
  // Test database info
  'testDatabase': 'mongodb://localhost:27017/mamasconnecttestdb',
  // Setting port for server
  'port': process.env.PORT || 3000,
  // default page size for pagination
  'pageSize': 25
}
