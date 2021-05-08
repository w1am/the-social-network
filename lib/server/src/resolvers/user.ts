import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { User } from "../entities/User";
import { hash, verify } from "argon2";
import { validateUsername, validatePassword } from "../utils/inputValidator";
import { MyContext } from "../types";
import { COOKIE_NAME } from "../constants";
import { getConnection, Not } from "typeorm";
import { Friend } from "../entities/Friend";

@ObjectType()
class FieldError {
  @Field(() => String)
  field?: string;
  @Field(() => String)
  message?: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@InputType()
class UserInput {
  @Field()
  username!: string;
  @Field()
  password!: string;
}

@ObjectType()
class FriendField {
  @Field()
  id: number
  @Field()
  friendId: number
  @Field()
  username: string
} 

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => [FriendField])
  async friends(@Root() user: User) : Promise<FriendField[] | null> {
    return await getConnection().createEntityManager().query(`
      SELECT friend.id, friend."userId", friend."friendId", friend.status, "user".username
      FROM friend
      INNER JOIN "user" ON friend."friendId"="user".id
      WHERE friend."userId"=${user.id} AND friend."status"=1;
    `)
  }

  @FieldResolver(() => Int)
  async association(@Root() user: User, @Ctx() { req } : MyContext) : Promise<number> {
    const association = await Friend.findOne({ where: {
      userId: req.session.userId,
      friendId: user.id,
      status: Not(-1)
    }})
    if (association) {
      return association.status
    } else {
      return -1
    }
  }

  @Query(() => User)
  async profile(@Arg('username', () => String) username: string): Promise<User | null> {
    const user = await User.findOne({ where: { username } })
    if (!user) {
      return null
    } else {
      return user
    }
  }

  @Query(() => [User], { nullable: true })
  async search(@Arg('query', () => String) query: string) : Promise<User[] | null> {
    if (query.trim() == "") {
      return null
    } else {
      const users = await getConnection().createEntityManager().query(`
        SELECT * FROM "user"
        WHERE username
        LIKE '%${query.toLowerCase()}%';
      `)
      if (!users) {
        return null
      } else {
        return users
      }
    }
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res } : MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("input") { username, password }: UserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse | null> {
    const previous = await User.findOne({ username });
    let errors = [];
    if (previous) {
      errors.push({
        field: "username",
        message: "username already exists",
      });
    }

    if (errors.length == 0 && validateUsername(username).length == 0 && validatePassword(password).length == 0) {
      const hashedPassword = await hash(password);
      const user = await User.create({
        username: username,
        password: hashedPassword,
      }).save();
      req.session.userId = user.id

      return { user };
    }

    return {
      errors: [
        ...errors,
        ...validateUsername(username),
        ...validatePassword(password),
      ],
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") { username, password }: UserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse | null> {
    const previous = await User.findOne({ where: { username } });
    if (!previous) {
      return {
        errors: [
          {
            field: "username",
            message: "cannot find account with this username",
          },
        ],
      };
    }
    const valid = await verify(previous.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "invalid password",
          },
        ],
      };
    }
    req.session.userId = previous.id
    return { user: previous };
  }
}
