export default () => ({
    database: {
        connectionString: process.env.MONGODB_URI,
        dbName : process.env.DB_NAME
    },
    jwt: {
        secret: process.env.JWT_SECRET
    }
})