import { ProductsService } from './../../services/products.service';
import { TransactionService } from './../../services/transaction.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

interface ProductData {
  product_name?: string;
  price?: number;
  quantity?: number;
  product_image?: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  productList = [];
  orderForm: FormGroup;
  // orderListData: Observable<ProductData[]>;
  // products:any = [
  //   {id: 1, product_name: "galon1" , price: 100, quantity: 2, product_image:"./../../../assets/images/g1.jpg"},
  //   {id: 2, product_name: "galon2" , price: 100, quantity: 2, product_image:"./../../../assets/images/g2.jpg"},
  //   {id: 3, product_name: "galon3" , price: 100, quantity: 2, product_image:"./../../../assets/images/g3.jpg"},
  //   {id: 4, product_name: "galon1" , price: 100, quantity: 2, product_image:"./../../../assets/images/g1.jpg"},
  //   {id: 5, product_name: "galon2" , price: 100, quantity: 2, product_image:"./../../../assets/images/g2.jpg"},
  //   {id: 6, product_name: "galon3" , price: 100, quantity: 2, product_image:"./../../../assets/images/g3.jpg"},
  //   {id: 7, product_name: "galon1" , price: 100, quantity: 2, product_image:"./../../../assets/images/g1.jpg"},
  //   {id: 8, product_name: "galon2" , price: 100, quantity: 2, product_image:"./../../../assets/images/g2.jpg"},
  //   {id: 9, product_name: "galon3" , price: 100, quantity: 2, product_image:"./../../../assets/images/g3.jpg"},
  // ];

  constructor(
    private router: Router,
    private authService:AuthService,
    public fb: FormBuilder,
    private productService: ProductsService
  ) {

  }


  ngOnInit() {
    this.getProductList();

    // this.authService.read_order().subscribe(data => {

    //   this.orderListData = data.map(e => {
    //     return {
    //       id: e.payload.doc.id,
    //       isEdit: false,
    //       product_name: e.payload.doc.data()['product_name'],
    //       price: e.payload.doc.data()['price'],
    //       quantity: e.payload.doc.data()['quantity'],
    //     };
    //   })
    //   console.log(this.orderListData);

    // });
    // this.orderListData = this.authService.read_order()
    // console.log('tttt',this.orderListData)
  }


  signOut() {
    this.authService.signOut().then(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    });
  }

  sendProductDetails(data) {
    console.log('eee',data.id)
    this.router.navigate([`/order-details/${data.id}`], { state: { infoData: data } });
  }

  getProductList(){
    this.productService.getProduct().subscribe(
      res => {
        this.productList  = res;
        console.log('333:',this.productList)
      }
    )
  }

}
