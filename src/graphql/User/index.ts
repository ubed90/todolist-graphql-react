import User from '../../models/User.model';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { RegisterInput, AuthResponse, UpdateInput } from './Types';
import { AuthenticationError } from 'apollo-server-core';
import { GraphQLContext } from '../../context';
import checkForAuthentication from '../../middlewares/checkForAuthentication';
import Todo from '../../models/Todo.model';

@Resolver(User)
class UserResolver {
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { user }: GraphQLContext
  ): Promise<User> | null {
    if(!user) return null;

    return await User.findByPk(user.id)
  }

  @Mutation(() => AuthResponse)
  async register(
    @Arg('data', () => RegisterInput) { email, firstName, lastName, password }: RegisterInput
  ): Promise<AuthResponse> {
    const user = await User.create({ email, firstName, lastName, password })

    const token = user.generateAuthToken();

    return { user, token };
  }

  @Mutation(() => AuthResponse)
  async login(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string
  ): Promise<AuthResponse> {
    const user = await User.findOne({ where: { email } });

    if(!user) throw new AuthenticationError('Email does not exists')

    const isValidCredentials = await user.comparePassword(password);

    if(!isValidCredentials) throw new AuthenticationError("Invalid Credentials");

    return { user, token: user.generateAuthToken() }
  }
  
  @UseMiddleware(checkForAuthentication)
  @Mutation(() => AuthResponse, { nullable: true })
  async updateProfile(
    @Arg('data', () => UpdateInput) data: UpdateInput,
    @Ctx() { user }: GraphQLContext
  ): Promise<AuthResponse> | null {
    const valuesToUpdate = Object.keys(data);
    
    for(let operation of valuesToUpdate) {
      (user as any)[operation] = data[operation as keyof typeof data];
    }

    await user.save({ validate: true });

    return { user, token: user.generateAuthToken() };    
  }

  // * Field Resolver on Main Resolver
  @FieldResolver(() => [Todo])
  async todos(
    @Ctx() { user, models }: GraphQLContext
  ): Promise<Todo[]> {
    const todos = await models.Todo.findAll({ where: { userId: user.id } });

    return todos;
  }
}

export default UserResolver;


// TODO - 1. Implement Authorization - DONE
// TODO - 2. IMPLEMENT USER CRUD - DONE
// TODO - 3. Implement TODO CRUD - DONE