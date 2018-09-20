import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class DataStorageService {
  constructor(private httpClient: HttpClient) {

  }



  // storeRecipes() {
  //   const token  = this.authService.getToken();
  //   return this.httpClient.put('https://ng-recipe-book-66704.firebaseio.com/recipes.json', this.recipeService.getRecipes(), {
  //     params: new HttpParams().set('auth', token)
  //   });
  // }
  //
  // getRecipes() {
  //   const token  = this.authService.getToken();
  //   return this.httpClient.get<Recipe[]>('https://ng-recipe-book-66704.firebaseio.com/recipes.json', {
  //     params: new HttpParams().set('auth', token)
  //   }).pipe(map(
  //     (recipes) => {
  //       for (let recipe of recipes) {
  //         if (!recipe['ingredients']) {
  //           recipe['ingredients'] = [];
  //         }
  //       }
  //       return recipes;
  //   }
  //   )).subscribe(
  //     (recipes: Recipe[]) => {
  //       console.log(recipes);
  //       this.recipeService.setRecipes(recipes);
  //     }
  //   );
  // }
}
