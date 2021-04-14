import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface TransactionData {
  product_name?: string;
  price?: string;
  quantity?: string;
}


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  tran_collection = 'transactions';

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,

  ) { }




  create_transaction(record) {
    return this.afs.collection(this.tran_collection).add(record);
  }



  getTransaction(id){
     return this.afs.collection(this.tran_collection).valueChanges({ idField: 'id' });
    //return this.afs.collection(this.tran_collection).doc(id).get()
  }

  get_transaction_detail(transacId){
    // console.log('RRRRR:',transacId)
    // return this.afs.collection(this.tran_collection).doc<TransactionData>(transacId).valueChanges();
    return this.afs.collection("transactions")
    .doc(transacId)
    .get()
  }


}
