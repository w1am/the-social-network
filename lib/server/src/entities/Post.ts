import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Vote } from "./Vote";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: string

  @Field()
  @Column({ default: 0 })
  likes: number

  @Field()
  @Column({ default: 0 })
  commentators: number

  @Field()
  @Column()
  description!: string

  @Field()
  @Column()
  userId: number

  @ManyToOne(() => User, (user) => user.posts)
  user: User

  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[]

  @OneToMany(() => Vote, (vote) => vote.post)
  comments: Comment[]
}