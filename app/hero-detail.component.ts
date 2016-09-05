import {Component, EventEmitter, OnInit, Input, Output} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";

import {Hero} from "./hero";
import {HeroService} from "./hero.service";

@Component({
    selector: "my-hero-detail",
    templateUrl: 'app/hero-detail.component.html',
    styleUrls: ['app/hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
    @Input() hero:Hero;
    @Output() close = new EventEmitter();
    error:any;
    navigated = false; // true if navigated here

    constructor(private heroService:HeroService,
                private route:ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.forEach((params:Params) => {
            if (params['id'] !== undefined) {
                let id = +params['id']; // convert to a number with the JavaScript (+) operator.
                this.navigated = true;
                this.heroService.getHero(id)
                    .then(hero => this.hero = hero);
            } else {
                this.navigated = false;
                this.hero = new Hero();
            }
        });
    }

    save() {
        this.heroService
            .save(this.hero)
            .then(hero => {
                this.hero = hero;  // save hero w/ id if new
                this.goBack(hero)
            })
            .catch(error => this.error = error); // TODO: Display error message
    }

    /*
     * Going back too far could take us out of the application.
     * That's acceptable in a demo. We'd guard against it in a real application,
     * perhaps with the CanDeactivate guard.
     * @see https://angular.io/docs/ts/latest/api/router/index/CanDeactivate-interface.html
     */
    goBack(savedHero:Hero = null) {

        /*
         *  The emit "handshake" between HeroDetailComponent and HeroesComponent is an example of component to component communication. This is a topic for another day,
         *  but we have detailed information in our Component Interaction Cookbook
         *  @see https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#child-to-parent
         */
        this.close.emit(savedHero);
        if (this.navigated) {
            window.history.back();
        }
    }

}