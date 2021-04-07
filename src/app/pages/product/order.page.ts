import { ProductsService } from './../../services/products.service';
import { TransactionService } from './../../services/transaction.service';
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { AngularFireAuth } from '@angular/fire/auth';

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
  modelData: any;
  idx: string;

  constructor(
    private router: Router,
    private authService:AuthService,
    public fb: FormBuilder,
    private productService: ProductsService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private afs: AngularFireAuth,
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
    let user = this.afs.user.subscribe(
      (data) => {
        console.log('UUU:',data)
        this.idx = data.uid;
      }
    );
    console.log('this is user:',user)
  }


  signOut() {
    this.authService.signOut().then(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    });
  }

  sendProductDetails(data) {

    this.router.navigate([`/order-details/${data.id}`], { state: { infoData: data } });
  }

  async getProductList(){
    const loading = await this.loadingController.create();
    await loading.present();
    this.productService.getProduct().subscribe(
      res => {
        loading.dismiss();
        this.productList  = res;
        console.log('333:',this.productList)
      }
    )
  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'caret-forward-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  openModal(){

  }

  async openIonModal(data) {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'model_title': "Nomadic model's reveberation",
        'proName': data.product_name,
        'prodImage': data.img,
        'prodPrice': data.price,
        'prodQuantity': data.quantity,
        'prodUser': this.idx,
        'prodId': data.id
      }
    });

    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        console.log('Modal Data : ' + modelData.data);
      }
    });

    return await modal.present();
  }


}
