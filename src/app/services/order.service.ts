import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';


export interface Item {
  user_id: number,
  product_name: string,
  value: string,
  price: number,
  product_image:string
}

const ITEMS_KEY = 'my-items';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // private item$ = new BehaviorSubject<Item[]>([]);
  private item$ = new BehaviorSubject<Item[] | undefined>(undefined);
  public myData: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  constructor(
    private storage: Storage,
    private toast:ToastController,
  ) {

  }
  // getItems() {
  //   return this.storage.get(ITEMS_KEY)

  // }
  getItems(){
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      console.log('rrr:',items)
      return this.myData.next(items)
    })
  }

  addItem(item:Item): Promise<any> {
    return this.storage.get(ITEMS_KEY)
    .then((items: Item[]) => {
      console.log('wwwkkkk:',items)
      if(items) {
        let newAddItems: Item[] = [];
        items.push(item);
        this.myData.next(items);
        return this.storage.set(ITEMS_KEY, items);

      }else {
        this.myData.next([item]);
        return this.storage.set(ITEMS_KEY, [item]);
      }
    })
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
      console.log('ddddd:',item)
      const index = items.findIndex(prop => prop.user_id === item.user_id)
      items.splice(index,1)
      this.myData.next(items);
      return this.storage.set(ITEMS_KEY, items);

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
