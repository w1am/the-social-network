import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @PrimaryColumn()
  postId: number

  @PrimaryColumn()
  userId: number

  @Column()
  @Field()
  comment: string

  @ManyToOne(() => User, (user) => user.comments)
  user: User

  @ManyToOne(() => User, (post) => post.comments)
  post: Post
}