
import {Params, ActivatedRouteSnapshot} from "@angular/router";
import {RouterAction, ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';
import {Actions, Effect} from '@ngrx/effects';
import * as appActions from '../actions/app.action';
import {Talk, Filters} from '../state/app.model';
import {State} from '../state/app.state';
import {Store, combineReducers} from "@ngrx/store";
import {Injectable} from "@angular/core";
import {of} from "rxjs/observable/of";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/withLatestFrom';
import {WatchService} from '../../watch';
import {Backend} from '../../backend';


@Injectable()
export class TalksEffects {
  @Effect() navigateToTalks = this.handleNavigation('talks', (r: ActivatedRouteSnapshot) => {
    const filters = createFilters(r.params);
    return this.backend.findTalks(filters).map(resp => ({type: 'TALKS_UPDATED', payload: {...resp, filters}}));
  });

  @Effect() navigateToTalk = this.handleNavigation('talk/:id', (r: ActivatedRouteSnapshot, state: State) => {
    const id = +r.paramMap.get('id');
    if (! state.app.talks[id]) {
      return this.backend.findTalk(+r.paramMap.get('id')).map(resp => ({type: 'TALK_UPDATED', payload: resp}));
    } else {
      return of();
    }
  });

  @Effect() rateTalk = this.actions.ofType('RATE').
  switchMap((a: appActions.Rate) => {
    return this.backend.rateTalk(a.payload.talkId, a.payload.rating).switchMap(() => of()).catch(e => {
      console.log('Error', e);
      return of({type: 'UNRATE', payload: {talkId: a.payload.talkId}});
    });
  });

  @Effect() watchTalk = this.actions.ofType('WATCH').
  map((a: appActions.Watch) => {
    this.watch.watch(a.payload.talkId);
    return {type: 'TALK_WATCHED', payload: a.payload};
  });

  constructor(private actions: Actions, private store: Store<State>, private backend: Backend, private watch: WatchService) {
  }

  private handleNavigation(segment: string, callback: (a: ActivatedRouteSnapshot, state: State) => Observable<any>) {
    const nav = this.actions.ofType(ROUTER_NAVIGATION).
    map(firstSegment).
    filter(s => s.routeConfig.path === segment);

    return nav.withLatestFrom(this.store).switchMap(a => callback(a[0], a[1])).catch(e => {
      console.log('Network error', e);
      return of();
    });
  }
}


function firstSegment(r: RouterNavigationAction) {
  return r.payload.routerState.root.firstChild;
}


function createFilters(p: Params): Filters {
  return {speaker: p['speaker'] || null, title: p['title'] || null, minRating: p['minRating'] ? +p['minRating'] : 0};
}
