export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  db: {
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT, 10) || 5432,
    name: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
  },
  jwt: {
    jwt_secret: process.env.SECRET,
    expiresIn: process.env.EXPIRES_IN || '12h',
  },
});
