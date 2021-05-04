import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { Vote } from "../entities/Vote";

@Resolver()
export class VoteResolver {
  @Mutation(() => Boolean)
  async vote(@Arg('postId', () => Int) postId: number, @Ctx() { req } : MyContext) : Promise<Boolean> {
    const previous = await Vote.findOne({
      where: {
        userId: req.session.userId,
        postId
      }
    })

    if (!previous) {
      await getManager().transaction(async em => {
        await em.createQueryBuilder().insert().into(Vote).values({
          userId: req.session.userId,
          postId,
          status: true
        }).execute()
        await em.createQueryBuilder().update(Post).where({ id: postId }).set({ likes: () => "likes + 1" }).execute()
      })
    } else {
      await getManager().transaction(async em => {
        await em.createQueryBuilder().update(Vote).where({
          userId: req.session.userId,
          postId,
        }).set({ status: previous.status ? false : true }).execute()
        await em.createQueryBuilder()
          .update(Post)
          .where({ id: postId })
          .set({ likes: () => previous.status ? "likes - 1" : "likes + 1" })
          .execute()
      })
    }

    return true
  }
}