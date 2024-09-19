export default () => ({
  port: Number(process.env.PORT) || 3000,
  jwt: {
    secret: String(process.env.JWT_SECRET),
    accessTokenExpiry: String(
      process.env.ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC,
    ),
    refreshTokenExpiry: String(
      process.env.REFRESH_TOKEN_VALIDITY_DURATION_IN_SEC,
    ),
  },
});
