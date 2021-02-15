import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';

import { Router } from '@angular/router'

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


  userId:string;



  // displayName: null
  // email: "lester@gmail.com"
  // phoneNumber: null
  // photoURL: null
  // providerId: "password"
  // uid: "lester@gmail.com"

  constructor(
    private router: Router,
    private authService:AuthService,
  ) { }

  ngOnInit() {

    let local = JSON.parse(localStorage.getItem('user'));
    console.log('local:',local);
    this.profileData = local;
    this.userId = local.uid;
    console.log('userid',this.userId)
    this.authService.getUserInfo(this.userId).subscribe(
      res => {
        console.log('info:',res)
      }
    )
  }


  signOut() {

    this.authService.signOut().then(() => {

      this.router.navigateByUrl('/tabs/login', { replaceUrl: true });

    });

  }



}


