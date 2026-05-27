declare const entityIdBrand: unique symbol;

export type EntityId = number & { readonly [entityIdBrand]: true };

export const toEntityId = (value: number): EntityId => value as EntityId;
