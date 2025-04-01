declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    POSTGRES_URI: string
    NODE_ENV: string
    JWT_SECRET: string
  }
}
