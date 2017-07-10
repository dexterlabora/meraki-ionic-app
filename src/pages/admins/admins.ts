import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';
import { AdminDetailsPage } from '../admin-details/admin-details'

//@IonicPage()
@Component({
  selector: 'page-admins',
  templateUrl: 'admins.html',
})
export class AdminsPage {
  admins: any;
  org: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public merakiService: MerakiService) {
    this.merakiService.getCurrentOrg().subscribe(data => {
      this.org = data;
      console.log("ssids page getCurrentOrg().subscribe: this.org",this.org);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Admins');

    this.merakiService.getAdmins(this.org.id).subscribe(data => {
      this.admins = data;
      console.log("Admins page: this.admins: ",this.admins);
    });
  }


  itemTapped(event, admin) {
    this.navCtrl.push(AdminDetailsPage, {
      admin: admin
    });
  }


}
