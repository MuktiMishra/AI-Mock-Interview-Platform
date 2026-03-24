import {OpenRouter} from "@openrouter/sdk"
import dotenv from 'dotenv'

dotenv.config()
console.log(process.env.OPENROUTER_API_KEY)

const model = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
})

export default model; 