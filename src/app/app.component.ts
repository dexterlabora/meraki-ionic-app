import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MerakiService } from '../services/meraki.service';

import { HomePage } from '../pages/home/home';
import { SsidsPage } from '../pages/ssids/ssids';
import { InventoryPage } from '../pages/inventory/inventory';
import { LicensePage } from '../pages/license/license';
import { DevicesPage } from '../pages/devices/devices';
import { AdminsPage } from '../pages/admins/admins';
import { ConfigTemplatesPage } from '../pages/config-templates/config-templates';
import { StaticRoutesPage } from '../pages/static-routes/static-routes';
import { VlansPage } from '../pages/vlans/vlans';
import { TrafficAnalysisPage } from '../pages/traffic-analysis/traffic-analysis';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';


@Component({
  templateUrl: 'app.html',
  providers: [MerakiService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icon:string}>;
  tools: Array<{title: string, component: any, icon:string}>;
  resources: Array<{title: string, component: any, icon:string}>;

  orgs: any;
  nets: any;
  org: {id: string, name, string};
  net: {id: string, name, string};



  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public merakiService: MerakiService
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: "home" },
      { title: 'SSIDs', component: SsidsPage, icon: "wifi"},
      { title: 'Devices', component: DevicesPage, icon: "list"},
      { title: 'Inventory', component: InventoryPage, icon: "list" },
      { title: 'License', component: LicensePage, icon: "key" },
      { title: 'Admins', component: AdminsPage, icon: "person" },
      { title: 'Templates', component: ConfigTemplatesPage, icon: "copy"},
      { title: 'Routes', component: StaticRoutesPage, icon: "settings"},
      { title: 'VLANs', component: VlansPage, icon: "pricetag"},
      { title: 'Traffic Analysis', component: TrafficAnalysisPage, icon: "stats"},
      { title: 'Settings', component: SettingsPage, icon: "settings"},
    ];

    this.tools = [
      { title: 'New Site', component: HomePage, icon: "home" },
    ];

    this.resources = [
      { title: 'About', component: AboutPage, icon: "information" },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      //this.initNetDefaults();
      this.splashScreen.hide();
    });
  }

  /*
  initNetDefaults() {
    console.log('app.component initNetDefaults()');

    // Set API Key and URL settings

    // Get initial organizations
    this.merakiService.getOrgs().subscribe(
      data => {
      this.orgs = data;
      console.log("app.component: this.orgs: ",this.orgs);

      // set default org
      console.log("app.component setting default org = ",this.orgs[0]);
      this.merakiService.setCurrentOrg(this.orgs[0]);

      // get networks after current org is determined
      this.merakiService.getNets(this.org.id).subscribe(data => {
        this.nets = data;
        console.log("app.component: this.nets: ",this.nets);

        console.log("app.component initializeDefaults: setting default net using org id = ",this.org.id);

        // set default net
        console.log("app.component initializeDefaults: this.net = ",this.net);
        this.merakiService.setCurrentNet(this.nets[0]);
      },
      error => {
        console.log('app.component: error getting intial orgs',error);
      });
    });
  }
  */


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


}
