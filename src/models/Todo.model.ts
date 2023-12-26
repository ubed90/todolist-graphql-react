import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Length,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import User from './User.model';
import { Field, Int, ObjectType, Root } from 'type-graphql';

@Table({
  timestamps: true,
  tableName: 'todo',
  modelName: 'Todo',
})
@ObjectType()
class Todo extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  @Field(() => Int)
  declare id: number;

  @Length({
    max: 1000,
    min: 2,
    msg: 'Text should be minimum of 2 and max of 1000 chars',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @Field(() => String)
  declare text: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @Field(() => Boolean)
  declare isCompleted: boolean;

  @CreatedAt
  @Field(() => String)
  declare createdAt: Date;

  @UpdatedAt
  @Field(() => String)
  declare updatedAt: Date;

  @Field(() => String)
  createdAtFormatted(@Root() todo: Todo): string {
    return todo.createdAt.toISOString(); // Adjust the format as needed
  }

  @Field(() => String)
  updatedAtFormatted(@Root() todo: Todo): string {
    return todo.updatedAt.toISOString(); // Adjust the format as needed
  }

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Field(() => String)
  declare userId: string;

  // * Field Resolver on Type Def's
  @BelongsTo(() => User)
  @Field(() => User)
  user(@Root() todo: Todo): Promise<User> {
    return User.findByPk(todo.userId);
  }
}

export default Todo;
