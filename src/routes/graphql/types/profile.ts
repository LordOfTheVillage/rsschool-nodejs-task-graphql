import {
    GraphQLBoolean,
    GraphQLFloat, GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList, GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from "graphql/type/index.js";
import {MemberType, memberTypeType} from "./member-type.js";
import {ContextType, User, userType} from "./user.js";
import {UUIDType} from "./uuid.js";
import {memberTypeIdType} from "./member-type-id.js";
import {postType} from "./post.js";

export interface Profile {
    id: string;
    isMale: boolean;
    yearOfBirth: number;
    user: User;
    memberType: MemberType;
}

export const profileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () =>  ({
        id: {type: UUIDType},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        user: {
            type: userType,
            resolve: async (source, args, { prisma }: ContextType) => (
                await prisma.user.findUnique({
                    where: {
                        id: source.userId
                    }
                })
            )
        },
        memberType: {
            type: memberTypeType,
            resolve: async (source, args, { prisma }: ContextType) => (
                await prisma.memberType.findUnique({
                    where: {
                        id: source.memberTypeId
                    }
                })
            )
        }
    })
})

export const createProfileInputType = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: () => ({
        userId: {type: new GraphQLNonNull(UUIDType)},
        isMale: {type: new GraphQLNonNull(GraphQLBoolean)},
        yearOfBirth: {type: new GraphQLNonNull(GraphQLInt)},
        memberTypeId: {type: new GraphQLNonNull(memberTypeIdType)}
    })
})

export const updateProfileInputType = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: () => ({
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        memberTypeId: {type: memberTypeIdType}
    })
})