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
import { Storage } from '@ionic/storage';

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
  userInfo :any;
  fn:string;

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
    private storage:Storage
  ) {

  }


  ngOnInit() {
    this.getProductList();

    let local = JSON.parse(localStorage.getItem('user'));
    this.authService.getUserInfo(local.uid).subscribe(
      res => {
        this.userInfo = res;
        this.fn = this.userInfo['full_name']
        console.log('info:',res)
      }
    )

    let user = this.afs.user.subscribe(
      (data) => {
        if(data){
          console.log('UUU:',data)
          this.idx = data.uid;
        }

      }
    );
    console.log('this is user:',user)
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


  async openIonModal(data) {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'model_title': "Nomadic model's reveberation",
        'proName': data.name,
        'prodImage': data.itemImage,
        'prodPrice': data.price,
        'prodUser': this.idx,
        'prodId': data.id,
        'type':'product',
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

  signOut() {

    this.authService.signOut().then(() => {
      localStorage.removeItem('user')
      this.storage.clear();
      this.router.navigateByUrl('/login', { replaceUrl: true });

    });

  }


}
