import { MyContext } from "src/types";
import { Arg, Ctx,  Field,  FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root } from "type-graphql";
import { getConnection, getManager } from "typeorm";
import { Post } from '../entities/Post';
import { User } from "../entities/User";
import { Vote } from "../entities/Vote";

@ObjectType()
class CommentField {
  @Field()
  id: number;
  @Field()
  comment: string;
  @Field()
  username: string;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => User)
  async user(@Root() post: Post) : Promise<User | null> {
    const user = await User.findOne(post.userId)
    if (!user) {
      return null
    } else {
      return user
    }
  }

  @FieldResolver(() => [CommentField])
  async comments(@Root() post: Post) : Promise<CommentField[]> {
    const comments = await getManager().query(`
      SELECT comment.id, comment, "user".username
      FROM comment
      INNER JOIN "user" ON comment."userId"="user".id
      WHERE comment."postId"=${post.id};
    `)
    return comments
  }

  @FieldResolver(() => Int)
  async likes(@Root() post: Post) : Promise<number> {
    const posts = await getConnection().createEntityManager().query(`
      SELECT * FROM vote WHERE status=true AND "postId"=${post.id};
    `)
    if (posts) {
      return posts.length
    } else {
      return 0
    }
  }

  @FieldResolver(() => Boolean)
  async status(@Root() post: Post, @Ctx() { req } : MyContext) : Promise<boolean> {
    if (req.session.userId) {
      const vote = await Vote.findOne({
        where: {
          postId: post.id,
          userId: req.session.userId
        }
      })
      if (vote) {
        return vote.status
      } else {
        return false
      }
    } else {
      return false
    }
  }

  @Query(() => [Post])
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => Int, { nullable: true }) cursor: number,
    @Arg("userId", () => Int, { nullable: true }) userId: number
  ) : Promise<Post[]> {
    const posts = await getManager().query(`
    SELECT * from post
    ${cursor ? `WHERE id < ${cursor} ${userId ? `AND "userId"=${userId}` : ''}` : userId ? `WHERE "userId"=${userId}` : ''}
    ORDER BY id DESC
    LIMIT ${limit}
    `)
    if (!posts) {
      return []
    }
    return posts
  }

  @Mutation(() => Post, { nullable: true })
  createPost(@Arg("description") description: string, @Ctx() { req }: MyContext): Promise<Post> | null {
    const userId = req.session.userId
    if (userId) {
      return Post.create({
        description,
        userId
      }).save()
    } else {
      return null
    }
  }
}