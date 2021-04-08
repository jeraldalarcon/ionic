import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface User {
  uid: string;
  email: string;
}

interface OrderData {
  product_name?: string;
  price?: string;
  quantity?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User = null;
  userData: any;
  product_collection = 'product';
  tran_collection = 'transaction';

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }


  async signup({ email, password, fullName, contactNumber }): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    const uid = credential.user.uid;

    return this.afs.doc(
      `users/${uid}`
    ).update({
      uid,
      email: credential.user.email,
      full_name: fullName,
      contact_number : contactNumber
    })
  }

  signIn({ email, password }) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }


  getUserInfo(userId){
    console.log('ID mo:',userId)
    return this.afs.collection('users').doc(userId).valueChanges();

  }

   getUsers() {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }


  create_order(record) {
    return this.afs.collection(this.product_collection).add(record);
  }

  read_order():Observable<OrderData[]>{
    return this.afs.collection<OrderData>(this.product_collection).valueChanges({ idField: 'id' });
  }

  get_order_detail(orderId:string): Observable<OrderData>{
    return this.afs.collection(this.product_collection).doc<OrderData>(orderId).valueChanges()
  }

  update_order(recordID, record) {
    this.afs.doc(this.product_collection + '/' + recordID).update(record);
  }

  delete_order(record_id) {
    this.afs.doc(this.product_collection + '/' + record_id).delete();
  }
}
