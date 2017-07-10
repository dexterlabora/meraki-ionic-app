import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


//@IonicPage()
@Component({
  selector: 'page-device-details',
  templateUrl: 'device-details.html',
})
export class DeviceDetailsPage {
  device: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.device = navParams.get('device');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceDetailsPage');
  }


}
