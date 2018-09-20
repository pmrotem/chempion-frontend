// import * as firebase from 'firebase';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  token: string;
  logged: boolean = false;

  constructor(private router: Router) {}

  signupUser(email: string, password: string) {
    // firebase.auth().createUserWithEmailAndPassword(email, password).catch(
    //   (error) => {console.log(error); }
    // );
    this.logged = true;
    this.router.navigate(['/']);
  }

  signinUser(email: string, password: string) {
    // firebase.auth().signInWithEmailAndPassword(email, password).then(
    //   (response) => {
    //     console.log(response);
    //     this.router.navigate(['/']);
    //     firebase.auth().currentUser.getIdToken().then(
    //       (token: string) => {
    //         this.token = token;
    //       }
    //     )
    //   }).catch(
    //   (error) => { console.log(error); }
    // );
    this.logged = true;
    this.router.navigate(['/']);
  }

  getToken() {
    // firebase.auth().currentUser.getIdToken().then(
    //   (token: string) => {
    //     this.token = token;
    //   });
    // return this.token;
  }

  isAuthenticated() {
    // return this.token != null;
    return this.logged
  }

  logout() {
    // firebase.auth().signOut();
    // this.token = null;
    // this.router.navigate(['/']);
    this.logged = false;
  }
}
