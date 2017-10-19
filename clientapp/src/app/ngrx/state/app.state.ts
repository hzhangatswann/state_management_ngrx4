import {Talk, Filters} from './app.model';

export type AppState = { talks: { [id: number]: Talk }, list: number[], filters: Filters, watched: { [id: number]: boolean } };
export type State = { app: AppState }; // this will also contain router state

export const initialState: State = {
  app: {
    filters: {speaker: "", title: "", minRating: 0},
    talks: {},
    list: [],
    watched: {}
  }
};
