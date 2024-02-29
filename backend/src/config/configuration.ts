export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  db: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.PG_PORT, 10) || 5432,
    name: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expiresIn: process.env.EXPIRES_IN || '12h',
  },
});
