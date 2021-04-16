import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
// import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';

interface TransactionData {
  product_name?: string;
  price?: string;
  quantity?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  tran_collection = 'transactions';
  DB: any;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.DB = firebase.firestore();
  }

  create_transaction(record) {
    const collection = this.afs.collection(this.tran_collection);
    const id = collection.doc().ref.id;
    record.id = id;
    return collection.doc(id).set(record);
  }

  //getTransaction(id){
  //return this.afs.collection(this.tran_collection).valueChanges({ idField: 'id' });
  //return this.afs.collection(this.tran_collection).where();

  //return this.afs.collection(this.tran_collection).doc(id);

  //}

  getTransaction(id) {
    return new Promise(async (resolve, reject) => {
      let data = [];
      this.DB.collection('transactions')
        .where('user_id', '==', id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            data.push(doc.data());
          });
          resolve(data);
        })
        .catch((error) => {
          resolve([]);
        });
    });
  }

  get_transaction_detail(transacId) {
    // console.log('RRRRR:',transacId)
    // return this.afs.collection(this.tran_collection).doc<TransactionData>(transacId).valueChanges();
    return this.afs.collection('transactions').doc(transacId).get();
  }
}
