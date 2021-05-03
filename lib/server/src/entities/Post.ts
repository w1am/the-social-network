import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: string

  @Field()
  @Column()
  description!: string

  @Field()
  @Column()
  userId: number

  @ManyToOne(() => User, (user) => user.posts)
  user: User
}