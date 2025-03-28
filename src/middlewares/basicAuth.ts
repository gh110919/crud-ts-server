import { config } from "dotenv";

export const basicAuth = await (async () => {
  const { AUTH_USR, AUTH_PWD } = config({
    path: ".local/.env",
  }).parsed!;

  return (await import("express-basic-auth")).default({
    users: { [`${AUTH_USR}`]: AUTH_PWD },
    challenge: true,
    unauthorizedResponse: JSON.stringify({
      success: false,
      message: "401 Unauthorized",
    }),
  });
})();
