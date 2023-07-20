import {GraphQLObjectType, GraphQLString} from "graphql/type/index.js";
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