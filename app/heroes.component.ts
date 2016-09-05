import {Component, OnInit} from '@angular/core';
import {HeroDetailComponent} from './hero-detail.component';
import {Hero} from "./hero";
import {HeroService} from "./hero.service";
import {Router} from "@angular/router";

@Component({
    selector: 'my-heroes',
    templateUrl: 'app/heroes.component.html',
    styleUrls: ['app/heroes.component.css'],
    directives: [HeroDetailComponent],
})
export class HeroesComponent implements OnInit {

    title = 'Tour of Heroes';
    private heroes:Hero[];
    selectedHero:Hero;
    error:any;
    addingHero = false;

    constructor(private router:Router,
                private heroService:HeroService) {
    }

    ngOnInit():any {
        return this.getHeroes();
    }

    onSelect(hero:Hero) {
        this.selectedHero = hero;
    }

    getHeroes() {
        this.heroService.getHeroes().then(heroes => this.heroes = heroes);
    }

    gotoDetail() {
        this.router.navigate(['/detail', this.selectedHero.id]);
    }

    addHero() {
        this.addingHero = true;
        this.selectedHero = null;
    }

    close(savedHero:Hero) {
        this.addingHero = false;
        if (savedHero) {
            this.getHeroes()
        }
    }

    /* Of course we delegate the persistence of hero deletion to the HeroService.
     * But the component is still responsible for updating the display.
     * So the delete method removes the deleted hero from the list.
     */
    deleteHero(hero:Hero, event:any) {
        event.stopPropagation();
        this.heroService.delete(hero)
            .then(res => {
                this.heroes = this.heroes.filter(h => h !== hero);
                if (this.selectedHero === hero) {
                    this.selectedHero = null
                }
                ;
            })
            .catch(error => this.error = error);
    }

}
