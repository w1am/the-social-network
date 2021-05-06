import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CommentField = {
  __typename?: 'CommentField';
  id: Scalars['Float'];
  comment: Scalars['String'];
  username: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Friend = {
  __typename?: 'Friend';
  id: Scalars['Float'];
  status: Scalars['Float'];
  user: User;
};

export type FriendField = {
  __typename?: 'FriendField';
  id: Scalars['Float'];
  friendId: Scalars['Float'];
  username: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  vote: Scalars['Boolean'];
  comment: Scalars['Boolean'];
  respond: Scalars['Boolean'];
  unfriend: Scalars['Boolean'];
  sendFriendRequest: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  createPost?: Maybe<Post>;
};


export type MutationVoteArgs = {
  postId: Scalars['Int'];
};


export type MutationCommentArgs = {
  comment: Scalars['String'];
  postId: Scalars['Int'];
};


export type MutationRespondArgs = {
  friendId: Scalars['Int'];
  status: Scalars['Int'];
};


export type MutationUnfriendArgs = {
  recipient: Scalars['Int'];
};


export type MutationSendFriendRequestArgs = {
  recipient: Scalars['Int'];
};


export type MutationRegisterArgs = {
  input: UserInput;
};


export type MutationLoginArgs = {
  input: UserInput;
};


export type MutationCreatePostArgs = {
  description: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['String'];
  likes: Scalars['Float'];
  commentators: Scalars['Float'];
  description: Scalars['String'];
  userId: Scalars['Float'];
  user: User;
  comments: Array<CommentField>;
  status: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  friends: Array<Friend>;
  friendRequests: Array<Friend>;
  profile: User;
  search: Array<User>;
  me?: Maybe<User>;
  greet: Scalars['String'];
  posts?: Maybe<Array<Post>>;
};


export type QueryProfileArgs = {
  username: Scalars['String'];
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['Float']>;
  limit: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  avatar: Scalars['String'];
  banner: Scalars['String'];
  intro: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  friends: Array<FriendField>;
};

export type UserInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type CommentMutationVariables = Exact<{
  comment: Scalars['String'];
  postId: Scalars['Int'];
}>;


export type CommentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'comment'>
);

export type CreatePostMutationVariables = Exact<{
  description: Scalars['String'];
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'description' | 'userId'>
  )> }
);

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'createdAt' | 'updatedAt'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & RegularErrorFragment
    )>> }
  ) }
);

export type RespondMutationVariables = Exact<{
  status: Scalars['Int'];
  friendId: Scalars['Int'];
}>;


export type RespondMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'respond'>
);

export type SendFriendRequestMutationVariables = Exact<{
  recipient: Scalars['Int'];
}>;


export type SendFriendRequestMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendFriendRequest'>
);

export type UnfriendMutationVariables = Exact<{
  recipient: Scalars['Int'];
}>;


export type UnfriendMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'unfriend'>
);

export type VoteMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type FriendRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type FriendRequestsQuery = (
  { __typename?: 'Query' }
  & { friendRequests: Array<(
    { __typename?: 'Friend' }
    & Pick<Friend, 'id' | 'status'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type FriendsQueryVariables = Exact<{ [key: string]: never; }>;


export type FriendsQuery = (
  { __typename?: 'Query' }
  & { friends: Array<(
    { __typename?: 'Friend' }
    & Pick<Friend, 'id'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Float'];
  cursor: Scalars['Float'];
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts?: Maybe<Array<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'description' | 'userId' | 'commentators' | 'status' | 'likes'>
    & { comments: Array<(
      { __typename?: 'CommentField' }
      & Pick<CommentField, 'id' | 'comment' | 'username'>
    )>, user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )>> }
);

export type ProfileQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type ProfileQuery = (
  { __typename?: 'Query' }
  & { profile: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'createdAt' | 'updatedAt' | 'avatar' | 'banner' | 'intro'>
    & { friends: Array<(
      { __typename?: 'FriendField' }
      & Pick<FriendField, 'id' | 'friendId' | 'username'>
    )> }
  ) }
);

export type SearchQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchQuery = (
  { __typename?: 'Query' }
  & { search: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  )> }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const CommentDocument = gql`
    mutation Comment($comment: String!, $postId: Int!) {
  comment(comment: $comment, postId: $postId)
}
    `;

export function useCommentMutation() {
  return Urql.useMutation<CommentMutation, CommentMutationVariables>(CommentDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($description: String!) {
  createPost(description: $description) {
    id
    description
    userId
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(input: {username: $username, password: $password}) {
    errors {
      ...RegularError
    }
    user {
      id
      username
    }
  }
}
    ${RegularErrorFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(input: {username: $username, password: $password}) {
    user {
      id
      username
      createdAt
      updatedAt
    }
    errors {
      ...RegularError
    }
  }
}
    ${RegularErrorFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const RespondDocument = gql`
    mutation Respond($status: Int!, $friendId: Int!) {
  respond(status: $status, friendId: $friendId)
}
    `;

export function useRespondMutation() {
  return Urql.useMutation<RespondMutation, RespondMutationVariables>(RespondDocument);
};
export const SendFriendRequestDocument = gql`
    mutation SendFriendRequest($recipient: Int!) {
  sendFriendRequest(recipient: $recipient)
}
    `;

export function useSendFriendRequestMutation() {
  return Urql.useMutation<SendFriendRequestMutation, SendFriendRequestMutationVariables>(SendFriendRequestDocument);
};
export const UnfriendDocument = gql`
    mutation Unfriend($recipient: Int!) {
  unfriend(recipient: $recipient)
}
    `;

export function useUnfriendMutation() {
  return Urql.useMutation<UnfriendMutation, UnfriendMutationVariables>(UnfriendDocument);
};
export const VoteDocument = gql`
    mutation Vote($postId: Int!) {
  vote(postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const FriendRequestsDocument = gql`
    query FriendRequests {
  friendRequests {
    id
    status
    user {
      id
      username
    }
  }
}
    `;

export function useFriendRequestsQuery(options: Omit<Urql.UseQueryArgs<FriendRequestsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FriendRequestsQuery>({ query: FriendRequestsDocument, ...options });
};
export const FriendsDocument = gql`
    query Friends {
  friends {
    id
    user {
      id
      username
    }
  }
}
    `;

export function useFriendsQuery(options: Omit<Urql.UseQueryArgs<FriendsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FriendsQuery>({ query: FriendsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    id
    username
  }
}
    `;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostsDocument = gql`
    query posts($limit: Float!, $cursor: Float!) {
  posts(limit: $limit, cursor: $cursor) {
    id
    description
    userId
    commentators
    comments {
      id
      comment
      username
    }
    user {
      id
      username
    }
    status
    likes
  }
}
    `;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const ProfileDocument = gql`
    query Profile($username: String!) {
  profile(username: $username) {
    id
    username
    createdAt
    updatedAt
    avatar
    banner
    intro
    friends {
      id
      friendId
      username
    }
  }
}
    `;

export function useProfileQuery(options: Omit<Urql.UseQueryArgs<ProfileQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ProfileQuery>({ query: ProfileDocument, ...options });
};
export const SearchDocument = gql`
    query search($query: String!) {
  search(query: $query) {
    id
    username
  }
}
    `;

export function useSearchQuery(options: Omit<Urql.UseQueryArgs<SearchQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchQuery>({ query: SearchDocument, ...options });
};