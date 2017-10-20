import {AppState, State} from '../state/app.state';
import {Action} from '../actions/app.action';
import {ActionReducerMap} from '@ngrx/store';

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TALKS_UPDATED': {
      return {...state, ...action.payload};
    }
    case  'TALK_UPDATED': {
      const talks = {...state.talks};
      talks[action.payload.id] = action.payload;
      return {...state, talks};
    }
    case 'RATE': {
      const talks = {...state.talks};
      talks[action.payload.talkId].rating = action.payload.rating;
      return {...state, talks};
    }
    case 'UNRATE': {
      const talks = {...state.talks};
      talks[action.payload.talkId].rating = null;
      return {...state, talks};
    }
    case 'TALK_WATCHED': {
      const watched = {...state.watched};
      watched[action.payload.talkId] = true;
      return {...state, watched};
    }
    default: {
      return state;
    }
  }
}

export const reducers: ActionReducerMap<State> = {
  app: appReducer
};
