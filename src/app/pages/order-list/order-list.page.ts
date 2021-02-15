import { TransactionService } from './../../services/transaction.service';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {
  // products:any = [
  //   {id: 1, product_name: "galon1" , price: 100, quantity: 2, product_image:"./../../../assets/images/g1.jpg"},
  //   {id: 2, product_name: "galon2" , price: 100, quantity: 2, product_image:"./../../../assets/images/g2.jpg"},
  //   {id: 3, product_name: "galon3" , price: 100, quantity: 2, product_image:"./../../../assets/images/g3.jpg"},

  // ];
  products:any = [];
  userInfo:any = [];
  prodName:string;
  prodImage: string;
  prodPrice: number;
  prodQuantity:number;
  len:number;
  grandTotal:number;
  modeOfPayment:string = "Cash Only";

  userId:string;

  contact_number:string;
  full_name:string;
  inputAddress:string;

  myDate:Date;
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude

  constructor(
    private router: Router,
    private authService:AuthService,
    private tranSac:TransactionService,
    private geolocation: Geolocation
  ) { }

  options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  };

  ngOnInit() {
    this.getCurrentCoordinates()
    this.getProductList();

    let local = JSON.parse(localStorage.getItem('user'));
    console.log('local:',local);
    this.userId = local.uid;
    this.authService.getUserInfo(this.userId).subscribe(
      res => {
        console.log('info:',res)
        this.userInfo = res;
        this.contact_number = this.userInfo.contact_number;
        this.full_name =  this.userInfo.full_name;
      }
    )
  }

  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      console.log('lat:',this.latitude)
      this.longitude = resp.coords.longitude;
      console.log('long:',this.longitude)
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  getProductList(){
    var localList = localStorage.getItem('data')
    var productList = JSON.parse(localList);
    this.products =  productList;
    this.len = this.products.length
    var val = 0;
    this.products.forEach(item => {
      val = val +item.price
      this.grandTotal =val;
    });

  }

  gotToTransaction(){
    alert('hello')
    this.getCurrentCoordinates()
    const obj = {
      fullName:this.full_name,
      products:this.products,
      contactNumber:this.contact_number,
      userId:this.userId,
      quantity:this.len,
      total:this.grandTotal,
      address:this.inputAddress,
      deliveryDate: this.myDate,
      long: this.latitude,
      lat:this.longitude
    }

    console.log('dataSend:',obj)
    this.tranSac.create_transaction(obj).then(
      res => {
        console.log('return data:',res)
      }
    )
    //this.router.navigateByUrl("/tabs/view-list")
  }

  gotToProductList() {
    this.router.navigateByUrl("/tabs/order")
  }

  deleteOrder(id){
    var localList = localStorage.getItem('data') || "[]";
    var p = JSON.parse(localList);
    p.splice(id ,1);
    var a2 = JSON.stringify(p);
    localStorage.setItem('data',a2);
    var u = localStorage.getItem('data')
    this.getProductList();
  }

  getIndex(index){
    console.log('index;',index)
    if(index){
      return index;
    }
  }


}

