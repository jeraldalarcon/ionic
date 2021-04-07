import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform:Platform,
    private statusBar: StatusBar,
    // private lottieSplashScreen: LottieSplashScreen
  ) {
    this.initializeApp();
  }

  initializeApp(){
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();

      setTimeout(() => {
        // this.lottieSplashScreen.hide();
      }, 2500)
    });
  }
}
