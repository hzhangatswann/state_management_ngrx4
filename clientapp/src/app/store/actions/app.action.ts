import { State } from '../state/app.state';
import { Talk, Filters } from '../state/app.model';
import { RouterAction } from '@ngrx/router-store';

export type TalksUpdated = { type: 'TALKS_UPDATED', payload: { talks: { [id: number]: Talk }, list: number[] }, filters: Filters };
export type TalkUpdated = { type: 'TALK_UPDATED', payload: Talk };
export type Watch = { type: 'WATCH', payload: { talkId: number } };
export type TalkWatched = { type: 'TALK_WATCHED', payload: { talkId: number } };
export type Rate = { type: 'RATE', payload: { talkId: number, rating: number } };
export type Unrate = { type: 'UNRATE', payload: { talkId: number, error: any } };
export type Action = RouterAction<State> | TalksUpdated | TalkUpdated | Watch | TalkWatched | Rate | Unrate;
