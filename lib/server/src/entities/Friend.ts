import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class Friend extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number

  @PrimaryColumn()
  userId: number

  @ManyToOne(() => User, (user) => user.friends)
  @JoinColumn({ name: "userId" })
  user: User

  @PrimaryColumn()
  friendId: number

  @Field()
  @Column({ default: 0 })
  status: number
}