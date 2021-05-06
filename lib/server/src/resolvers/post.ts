import { MyContext } from "src/types";
import { Arg, Ctx,  Field,  FieldResolver, Mutation, ObjectType, Query, Resolver, Root } from "type-graphql";
import { getManager } from "typeorm";
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
  user(@Root() post: Post) {
    return User.findOne(post.userId)
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

  @FieldResolver(() => Boolean)
  async status(@Root() post: Post, @Ctx() { req } : MyContext) {
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
      return null
    }
  }

  @Query(() => [Post], { nullable: true })
  async posts(
    @Arg("limit") limit: number,
    @Arg("cursor", { nullable: true }) cursor: number
  ) : Promise<Post[]> {
    const posts = await getManager().query(`
    SELECT * from post
    WHERE id <= ${cursor}
    ORDER BY id DESC
    LIMIT ${limit}
    `)
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