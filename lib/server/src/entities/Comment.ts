import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Field()
  @Column()
  comment: string

  @Column()
  userId: number

  @ManyToOne(() => User, (user) => user.comments)
  user: User

  @Column()
  postId: number

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post
}