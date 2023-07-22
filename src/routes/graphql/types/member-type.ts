import {GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType} from "graphql/type/index.js";
import {Profile, profileType} from "./profile.js";
import {memberTypeIdType} from "./member-type-id.js";
import {ContextType} from "./user.js";
import {MemberTypeId} from "../../member-types/schemas.js";
import {IdTypes, mapData} from "../utils/mapping.js";
import {PrismaClient} from "@prisma/client";

export interface MemberType {
    id: string;
    discount: number;
    postsLimitPerMonth: number;
    profiles: Profile[];
}

export const memberTypeType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: {type: memberTypeIdType},
        discount: {type: GraphQLFloat},
        postsLimitPerMonth: {type: GraphQLInt},
        profiles: {
            type: new GraphQLList(profileType),
            resolve: async ({id}: MemberType, args, { profilesByMemberTypeLoader }: ContextType) => (
                await profilesByMemberTypeLoader.load(id as MemberTypeId)
            )
        }
    })
})

export const memberTypeLoader = (prisma: PrismaClient) => async (ids: readonly MemberTypeId[]) => {
    const idsList = ids as MemberTypeId[]
    const memberTypes = await prisma.memberType.findMany({
        where: {
            id: {
                in: idsList
            }
        }
    })

    return mapData(memberTypes, idsList, IdTypes.ID);
}