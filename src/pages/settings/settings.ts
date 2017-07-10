import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';
import { ToastController } from 'ionic-angular';

//import { VlanDetailsPage } from '../vlan-details/vlan-details'

//@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  url: string;
  apiKey: string;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public merakiService: MerakiService,
    private toastCtrl: ToastController
  ) {}

  ionViewDidLoad() {
    // life cycle hook
    console.log('ionViewDidLoad Settings Page');
    this.url = this.merakiService.getUrl();
    this.apiKey = this.merakiService.getApiKey();
  }

  saveSettings(){
    this.merakiService.setUrl(this.url);
    this.merakiService.setApiKey(this.apiKey);
    this.merakiService.initializeDefaults();
    console.log("Settings Saved");
    this.presentToast("Settings Saved");

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
/*
  itemTapped(event, vlan) {
    this.navCtrl.push(VlanDetailsPage, {
      vlan: vlan
    });
  }
*/

}
