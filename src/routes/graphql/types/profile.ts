import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
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
