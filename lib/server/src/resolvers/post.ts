import { MyContext } from "src/types";
import { Arg, Ctx,  Mutation, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { Post } from '../entities/Post';

@Resolver(Post)
export class PostResolver {
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