import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { Comment } from '../entities/Comment'
import { Post } from "../entities/Post";

@Resolver()
export class CommentResolver {
  @Mutation(() => Boolean)
  async comment(
    @Arg('postId', () => Int) postId: number,
    @Arg('comment') comment: string,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    await getManager().transaction(async em => {
      await em.createQueryBuilder().insert().into(Comment).values({
        postId,
        userId: req.session.userId,
        comment
      }).execute()

      await em.createQueryBuilder()
        .update(Post)
        .where({ id: postId })
        .set({ commentators: () => "commentators + 1" })
        .execute()
    })
    return true
  }
}