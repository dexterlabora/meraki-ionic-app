import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';


//@IonicPage()
@Component({
  selector: 'page-inventory-page',
  templateUrl: 'inventory.html',
})
export class InventoryPage {
  org: any;
  inventory: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public merakiService: MerakiService) {
    this.merakiService.getCurrentOrg().subscribe(data => {
      this.org = data;
      console.log("Inventory page: orgId:", this.org.id);
    });



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventoryPage: org', this.org);

    this.merakiService.getInventory(this.org.id).subscribe(data => {
      this.inventory = data;
      console.log("Inventory page: this.inventory: ",this.inventory);
    });
  }

}
