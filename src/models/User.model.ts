import bcrypt from 'bcrypt';
import {
  Model,
  Table,
  DataType,
  Column,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BeforeCreate,
  Length,
  IsEmail,
  NotContains,
  BeforeUpdate,
} from 'sequelize-typescript';
import Todo from './Todo.model';
import { Field, ID, ObjectType, Root } from 'type-graphql';

// * JWT
import JWT from 'jsonwebtoken';

export const USER_ROLES = ['ADMIN', 'USER'];

@Table({
  timestamps: true,
  tableName: 'users',
  modelName: 'User',
})
@ObjectType()
class User extends Model<User> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  @Field(() => ID)
  declare id: string;

  @Length({ max: 50, msg: 'First Name can be max of 50 chars' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Field(() => String)
  declare firstName: string;

  @Length({ max: 50, msg: 'Last Name can be max of 50 chars' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Field(() => String)
  declare lastName: string;

  @IsEmail
  @Column({ type: DataType.STRING, allowNull: false, unique: { name: 'Unique-Email', msg: 'Email Already exists!' } })
  @Field(() => String)
  declare email: string;

  @NotContains({ args: 'Password', msg: 'Password is too weak.' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({
    type: DataType.ENUM,
    values: USER_ROLES,
    defaultValue: 'USER',
  })
  @Field(() => String)
  declare role: string;

  @CreatedAt
  @Field(() => String)
  declare created_at: Date;

  @UpdatedAt
  @Field(() => String)
  declare updated_at: Date;

  @Field(() => String)
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @BeforeUpdate
  @BeforeCreate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(instance.password, salt);
      instance.password = hashedPassword;
    }
  }

  @HasMany(() => Todo)
  @Field(() => [Todo])
  declare todos: Todo[];

  generateAuthToken(): string {
    const token = JWT.sign({ userId: this.id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    return token;
  }

  comparePassword(passwordToCheck: string): Promise<boolean> {
    return bcrypt.compare(passwordToCheck, this.password);
  }
}

export default User;
