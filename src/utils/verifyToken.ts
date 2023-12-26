import { AuthenticationError } from "apollo-server-core";
import JWT from "jsonwebtoken";

const verifyToken = (token: string): string => {
    const decryptedToken = JWT.verify(token, process.env.SECRET_KEY as string) as JWT.JwtPayload;
    if(!decryptedToken) throw new AuthenticationError("Token Expired. Please sign in Again")

    return decryptedToken.userId;
}

export default verifyToken;