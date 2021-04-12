import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { TransactionService } from './../../services/transaction.service';

interface TransactionData {
  product_name?: string;
  price?: string;
  quantity?: string;
}


@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.page.html',
  styleUrls: ['./view-list.page.scss'],
})
export class ViewListPage implements OnInit {

  idx: string;
  transaction:TransactionData;
  transactionList:any = [];
  userInfo :any;
  fn:string;

  constructor(
    private trasacService:TransactionService,
    private afs: AngularFireAuth,
    private authService:AuthService

  ) { }

  ngOnInit() {
    let local = JSON.parse(localStorage.getItem('user'));
    this.authService.getUserInfo(local.uid).subscribe(
      res => {
        this.userInfo = res;
        this.fn = this.userInfo.full_name
        console.log('info:',res)
      }
    )

    let user = this.afs.user.subscribe(
      (data) => {
        console.log('UUU:',data.uid)
        this.getTransactionList(data.uid);
      }
    );
    console.log('this is user:',user)

    this.trasacService.getTransaction().subscribe(
      res => {
        console.log('hello',res)
        this.transactionList = res;
      }
    )

  }

  // .then((docRef) => {console.log(docRef.data())})
  getTransactionList(idx) {
    this.trasacService.get_transaction_detail(idx).subscribe(
      res=> {
        console.log('yyyyyy',res)
      }
    )


  }

}
