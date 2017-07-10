import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';
//import { VlanDetailsPage } from '../vlan-details/vlan-details'

//@IonicPage()
@Component({
  selector: 'page-vlans',
  templateUrl: 'vlans.html',
})
export class VlansPage {
  vlans: any;
  net: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public merakiService: MerakiService) {
    this.merakiService.getCurrentNet().subscribe(data => {
      this.net = data;
      console.log("VLANs page getCurrentNet().subscribe: this.net",this.net);
    });
  }

  ionViewDidLoad() {
    // life cycle hook
    console.log('ionViewDidLoad VLANs Page');

    console.log("VLANs page: ionViewDidLoad: this.net:", this.net);

    this.merakiService.getVlans(this.net.id).subscribe(data => {
      this.vlans = data;
      console.log("VLANs page: this.vlans: ",this.vlans);
    });
  }

/*
  itemTapped(event, vlan) {
    this.navCtrl.push(VlanDetailsPage, {
      vlan: vlan
    });
  }
*/

}
