import { Platform, ToastController } from '@ionic/angular';
import { OrderService, Item } from './../../services/order.service';
import { TransactionService } from './../../services/transaction.service';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit ,ViewChild} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BehaviorSubject, Subject } from 'rxjs';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {

  public myDataList = new BehaviorSubject([]);
  public dataSource: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  products:any = [];
  userInfo :any;
  fn:string;
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
    private storage: Storage
  ) {


    // this.plt.ready().then(()=> {
    //   this.loadItems();
    // })
  }

  options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  };

  ngOnInit() {
    let local = JSON.parse(localStorage.getItem('user'));
    this.authService.getUserInfo(local.uid).subscribe(
      res => {
        this.userInfo = res;
        this.fn = this.userInfo.full_name
        console.log('info:',res)
      }
    )

    this.getCurrentCoordinates()
    this.getProductData();
    // this.loadItems();


    this.orderService.myData.subscribe(res => {
      this.items = res;
      console.log('infromation:',this.items)

      this.len = this.items.length;
      var val = 0;
      this.grandTotal = this.items.reduce((sum,item) => sum + item.price, 0);

    })



  }

  getProductData() {
    let local = JSON.parse(localStorage.getItem('user'));
    console.log('local:',local);
    this.userId = local.uid;
    console.log('USER ID KO:',this.userId)
    this.authService.getUserInfo(this.userId.toString()).subscribe(
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
    console.log('prodddddd:',this.items)

    // if(this.products.length === 0){
    //   this.router.navigateByUrl('/tabs/order')
    // }
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
      produtToDeliver:this.items,
      quantity:this.len,
      status: "Active",
      remarks:"",
      totalDeliveryPrice:this.grandTotal,
      long: this.latitude,
      lat:this.longitude,
      active:true,
    }

    console.log('buy ko to:',obj)
return
    this.tranSac.create_transaction(obj).then(
      res => {
            this.storage.clear();
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
      //this.loadItems();
      this.showToast('item added');
    })
  }

  // async loadItems(){
  //   await this.orderService.getItems().then(items => {
  //     this.items = items;
  //     console.log('rrr:',this.items)
  //   })
  // }

  // loadItems(){
  //   this.orderService.myData.subscribe(res => {

  //     this.items = res;
  //     console.log('infromation:',this.items)

  //     this.len = this.items.length;
  //     var val = 0;
  //     this.grandTotal = this.items.reduce((sum,item) => sum + item.price, 0);

  //   })
  // }

  updateItem(item: Item){
    item.product_name = `UPDATED: ${item.product_name}`;

    this.orderService.updateItem(item).then(item => {
      this.showToast('Item updated');
    })

  }

  deleteItem(item: Item){
    this.orderService.deleteItem(item).then(item => {
      console.log('yyyy:',item)
      //this.loadItems()
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

