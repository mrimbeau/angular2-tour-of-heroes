import {Component, OnInit} from '@angular/core';
import {Router}            from '@angular/router';
import {Observable}        from 'rxjs/Observable';
import {Subject}           from 'rxjs/Subject';
import {HeroSearchService} from './hero-search.service';
import {Hero}              from './hero';

@Component({
    selector: 'hero-search',
    templateUrl: 'app/hero-search.component.html',
    styleUrls: ['app/hero-search.component.css'],
    providers: [HeroSearchService]
})

/*
 * A Subject is a producer of an observable event stream;
 * searchTerms produces an Observable of strings, the filter criteria for the name search.
 * Each call to search puts a new string into this subject's observable stream by calling next.
 */
export class HeroSearchComponent implements OnInit {
    heroes:Observable<Hero[]>;
    private searchTerms = new Subject<string>(); // = Observable

    constructor(private heroSearchService:HeroSearchService,
                private router:Router) {
    }

    // Push a search term into the observable stream.
    search(term:string) {
        this.searchTerms.next(term);
    }

    ngOnInit() {
        this.heroes = this.searchTerms
            .debounceTime(300)        // wait for 300ms pause in events
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap(term => term   // switch to new observable each time, It cancels and discards previous search observables, returning only the latest (most recent) search service observable.
                // return the http search observable
                ? this.heroSearchService.search(term)
                // or the observable of empty heroes if no search term
                : Observable.of<Hero[]>([]))
            .catch(error => {
                // TODO: real error handling
                console.log(error);
                return Observable.of<Hero[]>([]);
            });
    }

    gotoDetail(hero:Hero) {
        let link = ['/detail', hero.id];
        this.router.navigate(link);
    }
}