import {Injectable} from "@angular/core";
import {HEROES} from "./mock-hero";
import {Hero} from "./hero";
import {Http, Headers} from "@angular/http";
import {getResponseURL} from "@angular/http/src/http_utils";

// There are scores of operators like toPromise that extend Observable with useful capabilities. If we want those capabilities, we have to add the operators ourselves.
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HeroService {

    private heroesUrl = 'app/heroes'; // URL to web api

    constructor(private http:Http) {
    }

    getHero(id:number) {
        return this.getHeroes()
            .then(heroes => heroes.find(hero => hero.id === id));
    }

    getHeroes() {
        //return Promise.resolve(HEROES);
        return this.http.get(this.heroesUrl)
            .toPromise()
            .then(response => response.json().data as Hero[])
            .catch(this.handleError);
    }

    getHeroesSlowly() {
        return new Promise<Hero[]>(resolve =>
            setTimeout(() => resolve(HEROES), 2000) // 2 seconds
        );
    }

    /*
     * We combine the call to the private post and put methods in a single save method.
     * This simplifies the public API and makes the integration with HeroDetailComponent easier.
     * HeroService determines which method to call based on the state of the hero object.
     * If the hero already has an id we know it's an edit. Otherwise we know it's an add.
     */
    save(hero:Hero):Promise<Hero> {
        if (hero.id) {
            return this.put(hero);
        }
        return this.post(hero);
    }

    // Delete existing Hero
    delete(hero:Hero) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.heroesUrl}/${hero.id}`;

        return this.http
            .delete(url, {headers: headers})
            .toPromise()
            .catch(this.handleError);
    }

    // Add new Hero
    // For Post requests we create a header and set the content type to application/json.
    // We'll call JSON.stringify before we post to convert the hero object to a string.
    private post(hero:Hero):Promise<Hero> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        return this.http
            .post(this.heroesUrl, JSON.stringify(hero), {headers: headers})
            .toPromise()
            .then(res => res.json().data)
            .catch(this.handleError);
    }

    // Update existing Hero
    // Same as 'Add', except the paramized URL
    private put(hero:Hero) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.heroesUrl}/${hero.id}`;

        return this.http
            .put(url, JSON.stringify(hero), {headers: headers})
            .toPromise()
            .then(() => hero)
            .catch(this.handleError);
    }

    private handleError(error:any) {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }

}