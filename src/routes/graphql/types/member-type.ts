import {GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from "graphql/type/index.js";
import {Profile, profileType} from "./profile.js";
import {memberTypeIdType} from "./member-type-id.js";
import {ContextType} from "./user.js";

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
            resolve: async (source, args, { prisma }: ContextType) => (
                await prisma.profile.findMany({
                    where: {
                        memberTypeId: source.id
                    }
                })
            )
        }
    })
})