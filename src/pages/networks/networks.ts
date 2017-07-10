import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';
import { HomePage } from '../home/home'

@Component({
  selector: 'networks-list',
  templateUrl: 'networks.html'
})

export class NetworksPage {
  nets: Array<{id: string, name: string}>;
  org: {id: string, name: string};

  constructor(public navCtrl: NavController, public navParams: NavParams, public merakiService: MerakiService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.org = navParams.get('org');

    this.merakiService.getNets(this.org.id).subscribe(data => this.nets = data);



  }

  itemTapped(event, net) {
    // set defaults
    this.merakiService.setCurrentNet(net);
    // route to HomePage
    this.navCtrl.push(HomePage, {net});
  }

}
