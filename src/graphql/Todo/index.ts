import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import Todo from "../../models/Todo.model";
import { GraphQLContext } from "../../context";
import checkForAuthentication from "../../middlewares/checkForAuthentication";
import { UserInputError } from "apollo-server-core";
import { UpdateTodoInput } from "./Types";

@Resolver(Todo)
class TodoResolver {
  @UseMiddleware(checkForAuthentication)
  @Query(() => Todo, { nullable: true })
  async getTodo(
    @Arg('id', () => Number) id: number,
    @Ctx() { user, models }: GraphQLContext
  ): Promise<Todo | void> {
    const todo = await models.Todo.findOne({ where: { id, userId: user.id } });

    if (!todo) throw new UserInputError(`No todo found with ID: ${id}`);

    return todo;
  }

  @UseMiddleware(checkForAuthentication)
  @Mutation(() => Todo)
  async createTodo(
    @Arg('text', () => String) text: string,
    @Ctx() { user }: GraphQLContext
  ): Promise<Todo> {
    const todo = await Todo.create({ text, userId: user.id });
    return todo;
  }

  @UseMiddleware(checkForAuthentication)
  @Query(() => [Todo], { nullable: true })
  async getAllTodos(
    @Arg('filter', () => String, { nullable: true }) filter: string, 
    @Ctx() { user, models }: GraphQLContext
  ): Promise<Todo[]> {
    const todos = await models.Todo.findAll({ where: { userId: user.id, ...(filter && filter !== 'all' && { isCompleted: filter === 'completed' }) }, order: [['createdAt', 'DESC']] });

    return todos;
  }

  @UseMiddleware(checkForAuthentication)
  @Mutation(() => Todo)
  async updateTodo(
    @Arg('id', () => Number) id: number,
    @Arg('data', () => UpdateTodoInput) data: UpdateTodoInput,
    @Ctx() { user, models }: GraphQLContext
  ): Promise<Todo | void> {
    const todo = await models.Todo.findOne({ where: { id, userId: user.id } });

    if (!todo) throw new UserInputError(`No todo found with ID: ${id}`);

    todo.text = data.text || todo.text;
    todo.isCompleted = data.isCompleted !== null ? data.isCompleted : todo.isCompleted;

    await todo.save({ validate: true });

    return todo;
  }
}

export default TodoResolver;