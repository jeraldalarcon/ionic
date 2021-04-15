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
  @Input() prodPrice: number;
  @Input() prodQuantity: string;
  @Input() prodUser: string;
  @Input() prodId: string;
  idx: string;
  productForm: FormGroup;
  items: Item[] = [];
  newItem: Item = <Item>{};
  total:Number = 0;

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
      product_name: [''],
      price: [0],
      quantity: ['', [Validators.required]],
      product_image: [''],
    });


    // this.total = this.prodPrice * this.productForm.value.quantity
    this.productForm.patchValue({
      product_name:this.proName,
      price: this.prodPrice,
      product_image: this.prodImage,
    });

  }

  get quantity() {
    return this.productForm.get('quantity');
  }

  getQ(ev:any){
    let val = ev.target.value;
    console.log('www:',val)
    return this.total = this.prodPrice * val;
  }

  async closeModel() {
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }


  addOrder(){
    if(!this.productForm.valid) return
    this.productForm.value.user_id = this.idx,
    this.productForm.value.product_id = this.prodId;
    this.productForm.value.total  = this.total;
    console.log('data ko:', this.productForm.value)
    this.orderService.addItem(this.productForm.value)
    .then(item => {
      console.log('items:',item)
      this.orderService.showToast('item added');
      this.closeModel();
      this.router.navigateByUrl('/tabs/order-list')
      // this.router.navigate(['/tabs/order-list'],{queryParams:item})
    })
  }


}
