import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Field, ObjectType } from 'type-graphql'
import { Post } from './Post'
import { Vote } from "./Vote";
import { Friend } from "./Friend";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String, { nullable: false })
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[]

  @OneToMany(() => Vote, (vote) => vote.user)
  comments: Comment[]

  @OneToMany(() => Friend, (friend) => friend.user)
  friends: Friend[]

  @Field()
  @Column({ default: "https://iupac.org/wp-content/uploads/2018/05/default-avatar-300x300.png" })
  avatar?: string;

  @Field()
  @Column({ default: "https://www.teahub.io/photos/full/303-3034192_default-banner-banner-jpg.jpg" })
  banner?: string;

  @Field()
  @Column({ default: "Hello World" })
  intro?: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}