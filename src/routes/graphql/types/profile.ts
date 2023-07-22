import {
    GraphQLBoolean, GraphQLInputObjectType,
    GraphQLInt, GraphQLNonNull,
    GraphQLObjectType,
} from "graphql/type/index.js";
import {MemberType, memberTypeType} from "./member-type.js";
import {ContextType, User, userType} from "./user.js";
import {UUIDType} from "./uuid.js";
import {memberTypeIdType} from "./member-type-id.js";
import {PrismaClient} from "@prisma/client";
import {IdTypes, mapData} from "../utils/mapping.js";

export interface Profile {
    id: string;
    isMale: boolean;
    yearOfBirth: number;
    user: User;
    userId: string;
    memberType: MemberType;
    memberTypeId: string;
}

export const profileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: {type: UUIDType},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        user: {
            type: userType,
            resolve: async ({userId}: Profile, args, {usersLoader}: ContextType) => (
                await usersLoader.load(userId)
            )
        },
        memberType: {
            type: memberTypeType,
            resolve: async ({memberTypeId}: Profile, args, {memberTypeLoader}: ContextType) => (
                await memberTypeLoader.load(memberTypeId)
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

export const profilesByUserLoader = (prisma: PrismaClient) => async (ids: readonly string[]) => {
    const idsList = ids as string[];
    const profiles = await prisma.profile.findMany({
        where: {userId: {in: idsList}},
    });

    return mapData(profiles, idsList, IdTypes.USER_ID);
};

export const profilesByMemberTypeLoader = (prisma: PrismaClient) => async (ids: readonly string[]) => {
    const idsList = ids as string[];
    const profiles = await prisma.profile.findMany({
        where: {memberTypeId: {in: idsList}},
    });

    return mapData(profiles, idsList, IdTypes.MEMBER_TYPE_ID);
}