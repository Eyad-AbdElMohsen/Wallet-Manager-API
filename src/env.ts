import dotenv from "dotenv";
dotenv.config()
import env from 'env-var'


export default{
    PORT:  env.get('PORT').required().asPortNumber(),
    JWT_SECRET_REFRESH: env.get('JWT_SECRET_REFRESH').required().asString(),
    JWT_SECRET_ACCESS: env.get('JWT_SECRET_ACCESS').required().asString(),
    googleOAuthRedirectUrl:  env.get('googleOAuthRedirectUrl').required().asString(),
    ClientSecret:  env.get('ClientSecret').required().asString(),
    ClientID:  env.get('ClientID').required().asString(),
    DB_URL:  env.get('DB_URL').required().asString(),
}