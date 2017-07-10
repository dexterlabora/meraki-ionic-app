import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';


//@IonicPage()
@Component({
  selector: 'page-license',
  templateUrl: 'license.html',
})
export class LicensePage {
  org: any;
  license: any;
  deviceCounts = {licenses: '0'}; // setting default value if unknown

  constructor(public navCtrl: NavController, public navParams: NavParams, public merakiService: MerakiService) {

    this.merakiService.getCurrentOrg().subscribe(data => {
      this.org = data;
      console.log("Inventory page: orgId:", this.org.id);
    });

    this.merakiService.getLicenseState(this.org.id).subscribe(data => {
      this.license = data;
      console.log("License page: this.license: ",this.license);
      this.deviceCounts = this.license.licensedDeviceCounts;
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad License Page: org', this.org);


  }

}
