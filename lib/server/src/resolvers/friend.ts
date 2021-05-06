import { MyContext } from "src/types";
import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from "type-graphql";
import { getManager } from "typeorm";
import { Friend } from "../entities/Friend";
import { User } from "../entities/User";

@Resolver(Friend)
export class FriendResolver {
  @FieldResolver(() => User)
  async user(@Root() friend: Friend) : Promise<User | null> {
    const user = await User.findOne(friend.friendId)
    if (!user) return null
    return user;
  }

  @Query(() => [Friend])
  async friends(@Ctx() { req } : MyContext) : Promise<Friend[]> {
    const friends = await Friend.find({
      userId: req.session.userId,
      status: 1
    })
    return friends
  }

  @Query(() => [Friend])
  async friendRequests(@Ctx() { req } : MyContext) : Promise<Friend[]> {
    const friends = await Friend.find({
      userId: req.session.userId,
      status: 0
    })
    return friends
  }

  @Mutation(() => Boolean) 
  async respond(
    @Arg('status', () => Int) status: number,
    @Arg('friendId', () => Int) friend: number,
    @Ctx() { req }: MyContext
  ) : Promise<boolean> {
    await getManager().transaction(async em => {
      await em.createQueryBuilder().update(Friend).set({
        status
      }).where({
        userId: req.session.userId,
        friendId: friend
      }).execute()

      await em.createQueryBuilder().insert().into(Friend).values({
        friendId: req.session.userId,
        userId: friend,
        status: 1
      }).execute()
    })

    return true
  }

  @Mutation(() => Boolean)
  async unfriend(
    @Arg('recipient', () => Int) recipient: number,
    @Ctx() { req }: MyContext
  ) : Promise<Boolean> {
    await getManager().transaction(async em => {
      em.createQueryBuilder().update(Friend).set({
        status: -1
      }).where({
        userId: req.session.userId,
        friendId: recipient
      }).execute()

      em.createQueryBuilder().update(Friend).set({
        status: -1
      }).where({
        userId: recipient,
        friendId: req.session.userId
      }).execute()
    })
    return true
  }

  @Mutation(() => Boolean)
  async sendFriendRequest(
    @Arg('recipient', () => Int) recipient: number,
    @Ctx() { req }: MyContext
  ) : Promise<Boolean> {
    const request = await Friend.findOne({
      where: {
        friendId: req.session.userId,
        userId: recipient,
        status: 0 | 1
      }
    })
    
    if(!request && (recipient != req.session.userId)) {
      Friend.create({
        userId: recipient,
        friendId: req.session.userId
      }).save()
      return true
    } else {
      return false
    }
  }
}