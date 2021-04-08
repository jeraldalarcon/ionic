import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, ToastController } from '@ionic/angular';


export interface Item {
  user_id: Number,
  product_name: string,
  value: string,
  price: Number,
  product_image:string
}

const ITEMS_KEY = 'my-items';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private storage: Storage,
    private toast:ToastController,
  ) { }

  addItem(item:any): Promise<any> {
    return this.storage.get(ITEMS_KEY)
    .then((items: Item[]) => {
      if(items) {
        items.push(item);
        return this.storage.set(ITEMS_KEY, items);
      }else {
        return this.storage.set(ITEMS_KEY, [item]);
      }
    })
  }

  async getItems():Promise<Item[]>{
    return await this.storage.get(ITEMS_KEY);
  }

  updateItem(item:Item): Promise<any>{
    return this.storage.get(ITEMS_KEY)
    .then((items:Item[])=> {
      if(!items || items.length === 0){
        return null;
      }
      let newItems: Item[] = [];

      for(let i of items){
        if(i.user_id === item.user_id){
          newItems.push(item);
        }else {
          newItems.push(item);
        }
      }
      return this.storage.set(ITEMS_KEY, newItems);

    })
  }

  deleteItem(item:Item): Promise<any>{
    return this.storage.get(ITEMS_KEY)
    .then((items:Item[])=> {
      if(!items || items.length === 0){
        return null;
      }
      let toKeep: Item[] = [];

      for(let i of items){
        if(i.user_id === item.user_id){
          toKeep.push(item);
        }
      }
      return this.storage.set(ITEMS_KEY, toKeep);

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
