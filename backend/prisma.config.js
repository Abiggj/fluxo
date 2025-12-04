require('dotenv').config()

exports.default = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
}
