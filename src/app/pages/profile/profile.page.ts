import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';

import { Router } from '@angular/router'
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profileData:[] = [];
  email:string;
  photoUrl:string;
  phoneNumber:string;
  userInfo:any;

  userId:string;


  constructor(
    private router: Router,
    private authService:AuthService,
    private storage:Storage
  ) { }

  ngOnInit() {

    let local = JSON.parse(localStorage.getItem('user'));
    console.log('local:',local);
    this.profileData = local;
    this.userId = local.uid;
    console.log('userid',this.userId)
    this.authService.getUserInfo(this.userId).subscribe(
      res => {
        this.userInfo = res;
        console.log('info:',res)
      }
    )
  }


  signOut() {

    this.authService.signOut().then(() => {
      localStorage.removeItem('user')
      this.storage.clear();
      this.router.navigateByUrl('/login', { replaceUrl: true });

    });

  }



}


