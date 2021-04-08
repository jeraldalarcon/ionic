import { Platform, ToastController } from '@ionic/angular';
import { OrderService, Item } from './../../services/order.service';
import { TransactionService } from './../../services/transaction.service';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit ,ViewChild} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {

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

  items: Item[] = [];
  newItem: Item = <Item>{};

  @ViewChild('myList')myList;

  constructor(
    private router: Router,
    private authService:AuthService,
    private tranSac:TransactionService,
    private geolocation: Geolocation,
    private orderService: OrderService,
    private plt: Platform,
    private toast:ToastController,
  ) {
    this.getProductList();

    this.plt.ready().then(()=> {
      this.loadItems();
    })
  }

  options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  };

  ngOnInit() {
    this.getCurrentCoordinates()
    this.getProductList();
    this.getProductData();

  }

  getProductData() {
    let local = JSON.parse(localStorage.getItem('user'));
    console.log('local:',local);
    this.userId = local.uid;
    console.log('elocal.uid',local.uid)
    this.authService.getUserInfo(this.userId).subscribe(
      res => {
        console.log('ttt:',res)
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
    var localList = localStorage.getItem('data')|| "[]";
    var productList = JSON.parse(localList);
    this.products =  productList;
    console.log('prodddddd:',this.products)

    if(this.products.length === 0){
      this.router.navigateByUrl('/tabs/order')
    }
    console.log('prod:',localStorage.getItem('data'))
    this.len = this.products.length
    var val = 0;
    this.products.forEach(item => {
      val = val +item.price
      this.grandTotal =val;
    });

  }

  gotToTransaction(){
    this.getCurrentCoordinates()

    const obj = {
      customer_name:this.full_name,
      contactNumber:this.contact_number,
      address:this.inputAddress,
      estimatedDelivery: this.myDate,
      id:this.userId,
      orderStatus:'Pending',
      produtToDeliver:this.products,
      quantity:this.len,
      status: "Active",
      remarks:"",
      totalDeliveryPrice:this.grandTotal,
      long: this.latitude,
      lat:this.longitude,
      active:true,
    }

    this.tranSac.create_transaction(obj).then(
      res => {
            localStorage.removeItem('data')
            var i  = localStorage.getItem('data')
            console.log('ggg:',i)
            this.products = [];
            console.log('ggg222:', this.products)
            this.router.navigateByUrl("/tabs/order")
      }
    )

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

  addItem(){
    this.orderService.addItem(this.newItem).then(item => {
      this.newItem = <Item>{};
      this.showToast('item added');
      this.loadItems();
    })
  }

  async loadItems(){
    await this.orderService.getItems().then(items => {
      this.items = items;
      console.log('rrr:',this.items)
    })
  }

  updateItem(item: Item){
    item.product_name = `UPDATED: ${item.product_name}`;

    this.orderService.updateItem(item).then(item => {
      this.showToast('Item updated');
    })

  }

  deleteItem(item: Item){
    this.orderService.updateItem(item).then(item => {
      this.showToast('Item Deleted');
    })

  }

  async showToast(msg){
    const toast = await this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


}

