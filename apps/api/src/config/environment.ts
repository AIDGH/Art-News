import Joi from "joi";

export type EnvironmentVariables = {
  NODE_ENV: "development" | "test" | "production";
  HOST: string;
  PORT: number;
  CORS_ORIGIN: string;
  SWAGGER_ENABLED: boolean;
  DATABASE_URL: string;
  SESSION_SECRET: string;
  SESSION_TTL_HOURS: number;
  UPLOAD_DIRECTORY: string;
};

const nodeEnvironment = process.env.NODE_ENV ?? "development";

export const environmentFilePaths = [`.env.${nodeEnvironment}`, ".env"];

export const environmentValidationSchema = Joi.object<EnvironmentVariables>({
  NODE_ENV: Joi.string()
    .valid("development", "test", "production")
    .default("development"),
  HOST: Joi.string()
    .ip({ version: ["ipv4", "ipv6"], cidr: "forbidden" })
    .default("127.0.0.1"),
  PORT: Joi.number().port().default(4001),
  CORS_ORIGIN: Joi.string().uri().default("http://localhost:3001"),
  SWAGGER_ENABLED: Joi.boolean()
    .truthy("true")
    .falsy("false")
    .default(nodeEnvironment !== "production"),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ["postgresql", "postgres", "file"] })
    .required(),
  SESSION_SECRET: Joi.string().min(32).when("NODE_ENV", {
    is: "production",
    then: Joi.required(),
    otherwise: Joi.string().default("local-art-news-session-secret-change-me"),
  }),
  SESSION_TTL_HOURS: Joi.number().integer().min(1).max(720).default(168),
  UPLOAD_DIRECTORY: Joi.string().default("../web/public/uploads"),
});
