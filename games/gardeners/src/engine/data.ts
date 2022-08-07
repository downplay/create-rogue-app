export interface DataDefinition<T> {
  name: string;
}

export const defineData = <T>(name: string): DataDefinition<T> => {
  return { name };
};

type DataRef<T> = {
  value: T;
};

type UpdateFunction<T> = (valueOrUpdate: T | ((current: T) => T | void)) => T;

export const hasData = <T>(
  def: DataDefinition<T>
): [data: DataRef<T>, update: UpdateFunction<T>] => {
  const entity = getEntityContext();
  if (!(def.name in entity.localData)) {
    entity.localData = 
  }

  return entity.localData[defName] ;
};
