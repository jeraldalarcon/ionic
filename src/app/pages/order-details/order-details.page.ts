import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { TransactionService } from './../../services/transaction.service';


interface OrderData {
  product_name: string;
  price: number;
  quantity: number;
  idx: string;
}

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  orderData: OrderData;
  productForm: FormGroup;
  public orderListData:[];
  products = [
    {id: 1, product_name: "galon1" , price: 100, quantity: 2, product_image:"./../../../assets/images/g1.jpg"},
  ];
  total:number = 100;

  public order:any;
  isCreate = true;
  isAdd = false;
  idx: string;

  proName:string;
  prodImage: string;
  prodPrice:number;
  prodQuantity:number;
  prodUser:string;
  prodId:string;

  constructor(
    private firebaseService: AuthService,
    public fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private afs: AngularFireAuth,
    private transacService: TransactionService
  ) {

  }

  ngOnInit() {

    this.productForm = this.fb.group({
      product_name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      user_id: [''],
      product_image: [''],
    });

    const idx = this.router.getCurrentNavigation().extras.state.infoData; // get the data in url

    this.productForm.patchValue({
      product_name:idx.product_name,
      price: idx.price,
      user_id: idx.user_id,
      product_image: idx.product_image
    });

    this.proName = this.productForm.value.product_name;
    this.prodImage = this.productForm.value.product_image;
    this.prodPrice = this.productForm.value.price;
    this.prodQuantity = this.productForm.value.quantity;
    this.prodUser = this.productForm.value.user_id;
    this.prodId = idx.id;

    console.log('product form:',this.productForm.value)

    let user = this.afs.user.subscribe(
      (data) => {
        console.log('UUU:',data.uid)
        this.idx = data.uid;
      }
    );
    console.log('this is user:',user)
  }

  // addToLocalStorageArray(name, value) {

  //   var existing: Array<string> = localStorage.getItem(name);
  //   existing = existing ? existing.split(',') : [];
  //   existing.push(value);
  //   localStorage.setItem(name, existing.toString());

  // };

  addOrder(){

    const form = this.productForm.value;
    let obj =
      {
        product_name: this.proName,
        price: this.prodPrice,
        quantity: this.prodQuantity,
        product_image: this.prodImage,
        user_id: this.prodUser,
        id:  this.prodId
      }

      var a = localStorage.getItem('data') || "[]";
      var i = JSON.parse(a);
      i.push(obj);
      var a2 = JSON.stringify(i);
      var p = localStorage.setItem('data',a2)
      console.log('yyy:',localStorage.getItem('data'))
      this.router.navigateByUrl('/tabs/order-list')
  }



}
