import { Request } from "express"
import Todo from "../models/Todo.model"
import User from "../models/User.model"
import JWT from "jsonwebtoken";
import { ExpressContext } from "apollo-server-express";

const getCurrentUser = async (req: Request): Promise<User> | null => {
    const token = req.headers['authorization']?.replace("Bearer ", "")

    if(!token) return null

    try {
        const decryptedToken = JWT.verify(token, process.env.SECRET_KEY) as JWT.JwtPayload;
        const user = await User.findByPk(decryptedToken.userId)

        if(!user) return null

        return user
    } catch (error) {
        return null
    }
}   

export type GraphQLContext = {
    models: { User: typeof User, Todo: typeof Todo }
    user: User | null,
    request: Request
}

export async function createContext({ req }: ExpressContext): Promise<GraphQLContext> {
    const user = await getCurrentUser(req)

    return {
        models: { User, Todo },
        user,
        request: req
    }
}

