import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


//@IonicPage()
@Component({
  selector: 'page-admin-details',
  templateUrl: 'admin-details.html',
})
export class AdminDetailsPage {
  admin: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.admin = navParams.get('admin');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminDetailsPage');
  }

}
