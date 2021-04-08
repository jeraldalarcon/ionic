import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Item, OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';


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
  items: Item[] = [];
  newItem: Item = <Item>{};

  constructor(
    private modalController: ModalController,
    private afs: AngularFireAuth,
    public fb: FormBuilder,
    private orderService:OrderService,
    private router: Router,
    ) {}

  ngOnInit() {
    let user = this.afs.user.subscribe(
      (data) => {
        console.log('UUU:',data.uid)
        this.idx = data.uid;
      }
    );
    console.log('this is user:',user)

    this.productForm = this.fb.group({
      product_name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      user_id: [''],
      product_image: [''],
    });

    this.productForm.patchValue({
      product_name:this.proName,
      price: this.prodPrice,
      user_id: this.idx,
      product_image: this.prodImage
    });

  }

  async closeModel() {
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }


  addOrder(){
    console.log('datat ko :',this.productForm.value)
    this.orderService.addItem(this.productForm.value)
    .then(item => {
      this.orderService.showToast('item added');
      this.closeModel();
      this.router.navigateByUrl('/tabs/order-list')
    })
  }


}
