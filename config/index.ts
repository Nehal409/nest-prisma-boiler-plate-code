export default () => ({
  port: Number(process.env.PORT) || 3000,
  jwt: {
    secret: String(process.env.JWT_SECRET),
    tokenExpiry: String(process.env.ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC),
  },
});
