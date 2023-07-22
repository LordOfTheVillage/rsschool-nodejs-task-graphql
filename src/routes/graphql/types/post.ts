import {GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql/type/index.js";
import {UUIDType} from "./uuid.js";
import {PrismaClient} from "@prisma/client";

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

export const updatePostInputType = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: {
        title: {type: GraphQLString},
        content: {type: GraphQLString},
    }
})

export const postsByAuthorLoader = (prisma: PrismaClient) => async (ids: readonly string[]) => {
    const idsList = ids as string[];
    const posts = await prisma.post.findMany({
        where: { authorId: { in: idsList } },
    });

    const map= posts.reduce((acc: Record<string, Post[]>, post) => {
        const authorId = post.authorId;
        if (authorId) {
            acc[authorId] = acc[authorId] ? [...acc[authorId], post] : [post];
        }
        return acc;
    }, {});

    return ids.map((id) => map[id]);
}