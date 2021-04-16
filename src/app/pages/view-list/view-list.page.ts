import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { TransactionService } from './../../services/transaction.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';


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
    private authService:AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private storage:Storage,
    private router: Router,
    private firestore: AngularFirestore,
    public modalController: ModalController,

  ) { }

  ionViewWillEnter() {
    let local = JSON.parse(localStorage.getItem('user'));
    this.authService.getUserInfo(local.uid).subscribe(
      res => {
        this.userInfo = res;
        // this.fn = this.userInfo.full_name;
      this.getTransaction(this.userInfo.id);
      }

    )
  }

  getTransaction(id) {
    this.trasacService.getTransaction(this.userInfo.uid).then((res)=> {
      this.transactionList = res;
      console.log(res,'doc.data()')
    })
  }

   ngOnInit() {
    let local = JSON.parse(localStorage.getItem('user'));



    // this.authService.getUserInfo(local.uid).subscribe(
    //   res => {
    //     this.userInfo = res;
    //     //this.fn = this.userInfo['full_name']
    //     console.log('info:',res)
    //   }
    // )

    let user = this.afs.user.subscribe(
      (data) => {
        console.log('UUU:',data.uid)
      }
    );
    console.log('this is user:',user)


  }



  // async getListTransac(){
  //   const loading = await this.loadingController.create();
  //   await loading.present();
  //   let local = JSON.parse(localStorage.getItem('user')).uid;
  //   this.trasacService.getTransaction(local).subscribe((res:any)=> {
  //     loading.dismiss();
  //     console.log('hello',res.docs);

  //     let newData = [];
  //     for (let product of res.docs) {
  //       console.log(product)
  //     }

  //   })
  // }

  async openIonModal(data) {
    console.log('ggg:',data)
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'view-list-style',
      componentProps: {
        'model_title': "Nomadic model's reveberation",
        'customerName': data.customer_name,
        'estimatedDelivery': data.estimatedDelivery,
        'address': data.address,
        'contact_number': data.contact_number,
        'type': 'transaction',
        'totalDeliveryPrice': data.totalDeliveryPrice,
        'productToDeliver': data.productToDeliver,
        'lat': data.lat,
        'long': data.long,
        'id': data.id,
        'orderStatus': data.orderStatus,
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
