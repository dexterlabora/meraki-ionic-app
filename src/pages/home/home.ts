import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';
import { SettingsPage} from '../settings/settings';
import { Events } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //org: {id: string, name: string};
  //net: {id: string, name: string};
  orgs: any;
  nets: any;
  org: any;
  net: any;
  inventory: any;
  license: any;

  baseUrl: string;

  constructor(
    public navCtrl: NavController,
    public merakiService: MerakiService,
    public events: Events
    ) {
      console.log("home constructor");


      events.subscribe('org:set', (org) => {
        console.log('home event: org updated', org);
        this.org = org;
        this.getData();
      });

      events.subscribe('net:set', (net) => {
        console.log('home event: net updated', net);
        this.net = net;
        this.getData();
      });


      this.merakiService.getCurrentOrg().subscribe(data => {
      this.org = data;
      console.log("Home Page: getCurrentOrg().subscribe: this.org ",this.org);

      this.merakiService.getCurrentNet().subscribe(data => {
        this.net = data;
        console.log("home page getCurrentNet().subscribe: this.net",this.net);
      });


    });
  }





  ionViewDidLoad() {
    // life cycle hook
    // this.org = this.merakiService.currentOrg;
    // this.net = this.merakiService.currentNet;

    //this.getTotalNetworks()
    console.log("home page, this.baseUrl: ",JSON.stringify(this.baseUrl));

    // used for debugging.
    this.baseUrl = this.merakiService.baseUrl;




    this.getData();


  }

  getData(){
    if(!this.org){
      return false;
    }
    this.merakiService.getInventory(this.org.id).subscribe(data => {
        this.inventory = data;
        console.log("Home Page: this.inventory: ",this.inventory);
      });

      this.merakiService.getLicenseState(this.org.id).subscribe(data => {
        this.license = data;
        console.log("License state: this.licenseState: ",this.license);
      });

      // update nets
      console.log('home event: getNets this.org.id',this.org.id);
      this.merakiService.getNets(this.org.id).subscribe(
        data => {
          console.log('home event: getNets data',data);
          this.nets = data;
        //console.log("home page getCurrentNet().subscribe: this.nets",this.nets);
        }),
        error => {
          console.log("home event: getNets error",error);
        };

  }


  /*
  getTotalNetworks(){

    if(this.org){
      this.merakiService.getNets(this.org.id).subscribe(data => {
        let nets = data;
        this.totalNetworks
        //console.log("home page getCurrentNet().subscribe: this.nets",this.nets);
      });
    }else{
      console.log('home getTotalNetworks - this.org == null')
    }


  };
  */


  loadSettings(){
    this.navCtrl.push(SettingsPage);
  }

}
