import React from "react";

type StateProps<T> = {
  state: T;
};

export function entity<TState, TProps extends StateProps<TState>>(
  WrappedComponent: React.ComponentType<TProps>
) {
  const state = useEntityState<T>();

  return (props: TProps) => (
    <EntityProvider state={state}>
      <WrappedComponent {...props} state={state}></WrappedComponent>
    </EntityProvider>
  );
}
