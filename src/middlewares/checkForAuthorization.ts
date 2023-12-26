import { GraphQLContext } from '../context';
import { AuthChecker, ResolverData } from 'type-graphql';

const checkForAuthorization: AuthChecker<
  ResolverData<{ context: GraphQLContext }>> = ({
    // ! Dunno why it is required to be destructured 3 times. NEED TO CHECK
  context: {
    context: { context },
  },
}, roles): boolean => {
  const { user } = context;

  if(!user) return false;

    const isAuthorized = roles.includes(user.role);

    if(!isAuthorized) return false;

    return true;
};


export default checkForAuthorization;