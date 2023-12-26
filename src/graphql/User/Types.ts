import { Field, InputType, ObjectType } from "type-graphql";
import User from "../../models/User.model";

@InputType()
export class RegisterInput {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    password: string;
}

@InputType()
export class UpdateInput {
  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  password: string;
}

// Define a new GraphQL type for the registration response
@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user: User;

  @Field(() => String)
  token: string;
}