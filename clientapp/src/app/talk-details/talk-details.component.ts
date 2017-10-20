import {Component, Input} from "@angular/core";
import {Backend} from "../backend";
import {ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/mergeMap';
import {WatchService} from "../watch";
import { Talk } from "../store/state/app.model";
import { State } from "../store/state/app.state";
import { Store } from "@ngrx/store";

@Component({
  selector: 'talk-details-cmp',
  templateUrl: './talk-details.component.html',
  styleUrls: ['./talk-details.component.css']
})
export class TalkDetailsComponent {
  talk: Talk;
  isWatched: boolean;

  constructor(private route: ActivatedRoute, private store: Store<State>) {
    store.select('app').subscribe(t => {
      const id = (+route.snapshot.paramMap.get('id'));
      this.talk = t.talks[id];
      this.isWatched = t.watched[id];
    });
  }

  handleRate(newRating: number): void {
    this.store.dispatch({
      type: 'RATE',
      payload: {
        talkId: this.talk.id,
        rating: newRating
      }
    });
  }

  handleWatch(): void {
    this.store.dispatch({
      type: 'WATCH',
      payload: {
        talkId: this.talk.id,
      }
    });
  }
}
