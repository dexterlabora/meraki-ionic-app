// Sets Global Organization and Network settings

import { Component } from '@angular/core';
import { MerakiService } from '../../services/meraki.service';
import { LoadingController } from 'ionic-angular';
import { Events } from 'ionic-angular';



@Component({
  selector: 'org-net-settings',
  templateUrl: 'org-net-settings.html'
})
export class OrgNetSettings {

  // Org/Net selectors
  orgs: Array<{id: string, name: string}>;
  nets: Array<{id: string, name: string}>;
  org: {id: string, name: string};
  net: {id: string, name: string};


  constructor(
    public merakiService: MerakiService,
    public loading: LoadingController,
    public events: Events) {
      console.log("org-net-settings constructor");

      // Listen for any changes to the Organization, then update the selectors
      events.subscribe('org:set', (org) => {
        console.log('org-net settings event: org updated', org);
        this.org = org;

        // Once an organization is selected, get the related networks.
        let loader = this.loading.create({
          content: 'Getting Networks...',
        });
        loader.present();
        console.log("org-net-settings  getNets this.org.id",this.org.id);
        this.merakiService.getNets(this.org.id).subscribe(
          data => {
            console.log("org-net-settings: this.nets: ",this.nets);
            this.nets = data;
            this.net = this.nets[0] // set default network in list
            // Set Current Network
            this.merakiService.setCurrentNet(this.net);
            // dismiss the loader
            loader.dismiss();
          },
          err => {
            console.log("error getting nets",err);
            this.nets = null;
            loader.dismiss();
          });
      });
      // Listen for any changes to the Network, then update the selector
      events.subscribe('net:set', (net) => {
        console.log('org-net settings event: net updated', net);
        this.net = net;
      });

  }


  ngOnInit() {
    let loader = this.loading.create({
      content: 'Getting data...',
    });
    loader.present();

    this.merakiService.getOrgs().subscribe(
      data => {
        this.orgs = data;
        this.net = this.orgs[0] // set default network to first
        console.log("org-net-settings: this.orgs: ",this.orgs);

        // get current Org
        this.merakiService.getCurrentOrg().subscribe(data => {
          this.org = data;
          console.log("org-net-settings: getCurrentOrg().subscribe: this.org ",this.org);

          // get networks after current org is determined
          console.log("org-net-settings: getNets");
          if(this.org.id){
            this.merakiService.getNets(this.org.id).subscribe(
              data => {
                this.nets = data;
                console.log("org-net-settings: this.nets: ",this.nets);
              },
              error => {
                console.log("org-net-settings: getNets error (likely no networks) ",error);
              }
            );

          }else{
            console.log("org-net-settings: no orgs returned");
          }

        });
        loader.dismiss();
      },
      error => {
        console.log("org-net-settings: error");
        loader.dismiss();
      }
    );

  }


  orgFormSelected(orgId){

    // get matching org object
    let selectedOrg = this.orgs.find((o)=>{
       return o.id === orgId;
    });
     console.log("orgFormSelected(orgId) = ",orgId);
     console.log("orgFormSelected selectedOrg = ",selectedOrg);

     // Set Current Organization
     this.merakiService.setCurrentOrg(selectedOrg);

  }

  netFormSelected(netId){
    // get matching net object
    let selectedNet = this.nets.find((n)=>{
       return n.id === netId;
    });
     console.log("netFormSelected selectedOrg = ",selectedNet);
     this.net=selectedNet;

     // Set Current Network
     this.merakiService.setCurrentNet(this.net);
  }

}
