import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';


interface OrderData {
  product_name?: string;
  price?: string;
  quantity?: string;
  user_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  product_collection = 'inventory';

  constructor(
    private afs: AngularFirestore
  ) { }


  getProduct():Observable<OrderData[]>{
    return this.afs.collection<OrderData>(this.product_collection).valueChanges({ idField: 'id' });
  }
}
