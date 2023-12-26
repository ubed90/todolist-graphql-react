import { MiddlewareFn } from "type-graphql";
import { GraphQLContext } from "../context";
import { AuthenticationError } from "apollo-server-core";

const checkForAuthentication: MiddlewareFn<GraphQLContext> = async ({ context: { user }, args }, next) => {
    console.log(args);
    
    if(!user) {
        throw new AuthenticationError('Session Expired. Please Sign in again.', {
            code: 501
        });
    }

    return next();
}

export default checkForAuthentication;