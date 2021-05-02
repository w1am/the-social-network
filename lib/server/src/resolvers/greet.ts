import { Query, Resolver,
} from "type-graphql";

@Resolver()
export class GreetResolver {
  @Query(() => String)
  greet(): string {
    return "Hello World"
  }
}
