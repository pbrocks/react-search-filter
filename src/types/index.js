// @flow

export type Callback = (any) => any;

/* ---------------------- REDUX ------------------------ */
export type Action = {
  type: string,
  data: Object,
};

export type ActionCreator = (any) => Action;

export type DataState = Map<string, ? any> ;

export type Reducer = (state: DataState, action: Action) => DataState;
