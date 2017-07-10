import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';
//import { StaticRoutesDetailsPage } from '../static-routes-details/static-routes-details'


//@IonicPage()
@Component({
  selector: 'page-static-routes',
  templateUrl: 'static-routes.html',
})
export class StaticRoutesPage  {
  routes: any;
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

    this.merakiService.getStaticRoutes(this.net.id).subscribe(data => {
      this.routes = data;
      console.log("Static Routes page: this.routes: ",this.routes);
    });
  }

/*
  itemTapped(event, route) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(StaticRoutesDetailsPage, {
      route: route
    });
  }
  */

}
