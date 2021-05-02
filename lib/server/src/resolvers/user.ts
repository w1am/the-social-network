import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import { hash, verify } from "argon2";
import { validateUsername, validatePassword } from "../utils/inputValidator";
import { MyContext } from "../types";
import { COOKIE_NAME } from "../constants";

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

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(1);
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
    console.log(password)
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
