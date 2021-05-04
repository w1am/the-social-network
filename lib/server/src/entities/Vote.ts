import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class Vote extends BaseEntity {
  @Field()
  @Column({ default: false })
  status: boolean

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.votes)
  user: User

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.votes)
  post: Post
}