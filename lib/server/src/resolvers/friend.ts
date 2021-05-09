import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, PubSub, Query, Resolver, Root, Subscription } from "type-graphql";
import { getConnection, getManager } from "typeorm";
import { Friend } from "../entities/Friend";
import { User } from "../entities/User";
import { RedisPubSub } from "graphql-redis-subscriptions";

const NOTIFICATION_TOPIC = 'SEND_FRIEND_REQUEST_NOTIFICATION'

@ObjectType()
class FriendNotification {
  to: number;
  from: number;
  message: string;
}

@ObjectType()
class NotificationResponse {
  @Field(() => String)
  username: string;
  @Field(() => Int)
  userId: number;
  @Field(() => String)
  message: string;
}

@Resolver(Friend)
export class FriendResolver {
  @Subscription(
    () => NotificationResponse,
    {
      topics: NOTIFICATION_TOPIC,
      nullable: true,
      filter: ({ payload, context }) => {
        console.log("to", payload.to)
        console.log("userId", context.connection.context.req.session.userId)
        if (payload.to == context.connection.context.req.session.userId) {
          return true
        } else {
          return false
        }
      }
    }
  )
  async newFriendNotification(
    @Root() payload: FriendNotification,
  ): Promise<NotificationResponse> {
    const from = await User.findOne(payload.from)
    return {
      username: from!.username,
      userId: payload.from,
      message: payload.message
    }
  }

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

      await em.createQueryBuilder().update(Friend).set({
        status
      }).where({
        userId: friend,
        friendId: req.session.userId
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
      await em.createQueryBuilder().delete().from(Friend).where({
        userId: req.session.userId,
        friendId: recipient
      }).execute()

      await em.createQueryBuilder().delete().from(Friend).where({
        userId: recipient,
        friendId: req.session.userId
      }).execute()
    })
    return true
  }

  @Mutation(() => Boolean)
  async sendFriendRequest(
    @Arg('recipient', () => Int) recipient: number,
    @Ctx() { req }: MyContext,
    @PubSub() pubsub: RedisPubSub
  ) : Promise<Boolean> {
    const request = await getConnection().createEntityManager().query(`
      SELECT * FROM friend
      WHERE "friendId"=${req.session.userId} AND "userId"=${recipient} AND (status=0 OR status=1);
    `)
    
    if ((!request || request.length == 0) && (recipient != req.session.userId)) {
      await getManager().transaction(async em => {
        await em.createQueryBuilder().insert().into(Friend).values({
          userId: recipient,
          friendId: req.session.userId
        }).execute()

        await em.createQueryBuilder().insert().into(Friend).values({
          userId: req.session.userId,
          friendId: recipient
        }).execute()
      })
      pubsub.publish(
        NOTIFICATION_TOPIC,
        { to: recipient, from: req.session.userId, message: `New friend request` }
      )
      return true
    } else {
      return false
    }
  }
}