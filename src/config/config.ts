export default () => ({
    database: {
        connectionString: process.env.MONGODB_URI
    },
    jwt: {
        secret: process.env.JWT_SECRET
    }
})