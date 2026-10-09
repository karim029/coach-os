import { JwtPayload } from "../auth/strategies/jwt.strategy.ts";

declare global {
    namespace Express{
        interface User{
            
                id: string
                email: string
                role: string
            
        }
    }
}

export{}