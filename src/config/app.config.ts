export default () => ({
    environment: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USER,
        name: process.env.DATABASE_NAME,
        pass: process.env.DATABASE_PASSWORD,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
})