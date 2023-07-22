export enum IdTypes {
    ID = 'id',
    USER_ID = 'userId',
    MEMBER_TYPE_ID = 'memberTypeId',
}

interface HasId {
    id: string;
}
export function mapData<T extends HasId> (list: T[], ids: string [], field: string): T[] {
    const map: Record<string, T> = list.reduce((acc, item) => ({ ...acc, [item[field]]: item }), {});
    return ids.map(id => map[id]);
}