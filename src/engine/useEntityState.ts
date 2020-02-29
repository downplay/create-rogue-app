import {useContext,useCallback} from 'react';


export const useEntityState = <T>(key:symbol, initialState: T): [T, (nextState:T) => void] => {
  const entity = useContext<EntityState>(EntityContext);

  const setEntityState = useCallback((nextState:T) => {
      entity.update( setState(nextState)
  }, [entities])
  return [ state[key],setEntityState ];
};

export const entitiesActions = {

}