import {GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql/type/index.js";
import {UUIDType} from "./uuid.js";

export interface Post {
    id: string;
    title: string;
    content: string;
}

export const postType = new GraphQLObjectType({
    name: 'Post',
    fields: {
        id: {type: UUIDType},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
    }
})

export const createPostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
    fields: {
        title: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: new GraphQLNonNull(UUIDType)}
    }
})