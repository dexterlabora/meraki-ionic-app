import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';
import { SsidDetailsPage } from '../ssid-details/ssid-details'

/**
 * Generated class for the Ssids page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-ssids',
  templateUrl: 'ssids.html',
})
export class SsidsPage {
  ssids: any;
  net: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public merakiService: MerakiService) {
    this.merakiService.getCurrentNet().subscribe(data => {
      this.net = data;
      console.log("ssids page getCurrentNet().subscribe: this.net",this.net);
    });
  }

  ionViewDidLoad() {
    // life cycle hook
    console.log('ionViewDidLoad SsidsPage');

    console.log("SSIDs page: ionViewDidLoad: this.net:", this.net);

    this.merakiService.getSsids(this.net.id).subscribe(data => {
      this.ssids = data;
      console.log("SSIDs page: this.ssids: ",this.ssids);
    });
  }

  itemTapped(event, ssid) {
    this.navCtrl.push(SsidDetailsPage, {
      ssid: ssid,
      net: this.net
    });
  }

}
