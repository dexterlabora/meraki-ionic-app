import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';
import { NetworksPage } from '../networks/networks'

@Component({
  selector: 'organizations-list',
  templateUrl: 'organizations.html'
})
export class OrganizationsPage {
  orgs: Array<{id: string, name: string}>;
  org: {id: string, name: string};
  //org: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public merakiService: MerakiService) {
    this.merakiService.getOrgs().subscribe(data => {
      this.orgs = data;
      console.log("organizations page: this.orgs: ",this.orgs);
    });
  }

  ionViewDidLoad() {
    // life cycle hook
  }

  /*
  itemTapped(event, orgId) {
    this.org = this.orgs[orgId];
    this.org = this.orgs.find(id:orgId);
    this.navCtrl.push(NetworksPage, {
      orgId : orgId
    });
  }
  */

  itemTapped(event, org) {
    // set defaults
    this.merakiService.setCurrentOrg(org);

    // route to network page
    this.navCtrl.push(NetworksPage, {org});
  }


}
