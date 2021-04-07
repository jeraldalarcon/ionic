import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() model_title: string;
  @Input() proName: string;
  @Input() prodImage: string;
  @Input() prodPrice: string;
  @Input() prodQuantity: string;
  @Input() prodUser: string;
  @Input() prodId: string;
  idx: string;
  productForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private afs: AngularFireAuth,
    ) {}

  ngOnInit() {
    let user = this.afs.user.subscribe(
      (data) => {
        console.log('UUU:',data.uid)
        this.idx = data.uid;
      }
    );
    console.log('this is user:',user)
  }

  async closeModel() {
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

  addOrder(){

  }

}
