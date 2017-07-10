// Sets Global Organization and Network settings

import { Component } from '@angular/core';
import { MerakiService } from '../../services/meraki.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Subscription } from 'rxjs';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'claim-device',
  templateUrl: 'claim-device.html'
})
export class ClaimDevice {

  // Org/Net selectors
  net: {id: string, name: string};
  org: {id: string, name: string};
  serial: string;
  message: any;
  orgDevices: any;

  lastNetId: string;

  searchTerm: string = '';
  filteredDevices: any;

  //private subscriptions: Subscription;

  constructor(public merakiService: MerakiService, private barcodeScanner: BarcodeScanner, private toastCtrl: ToastController) {
    //this.subscriptions = new Subscription();
    this.message = "Ready to add..";




  }

  ngOnInit() {
    console.log("org-net-settings component ngOnInit");

      this.merakiService.getCurrentOrg().subscribe(data => {
        this.org = data;
        console.log("home page: getCurrentOrg().subscribe: this.org ",this.org);
      });

      this.merakiService.getCurrentNet().subscribe(data => {
        this.net = data;
        console.log("home page getCurrentNet().subscribe: this.net",this.net);
      });

      this.merakiService.getInventory(this.org.id).subscribe(data => {
        this.orgDevices = data;
        //this.filteredDevices = this.orgDevices;
        this.setFilteredOrgs();
        console.log("Devices page: this.orgDevices: ",this.orgDevices);
      });

      this.lastNetId = this.net.id;

  }

  ngDoCheck() {
    //console.log("devices ngDoCheck");
    //console.log("this.net.id: ",this.net.id);
    //console.log("this.lastNetId: ",this.lastNetId);

    // Update list if the Network ID has changed
    if(this.net.id != this.lastNetId){
      this.merakiService.getInventory(this.org.id).subscribe(data => {
        this.orgDevices = data;
        this.setFilteredOrgs();
        console.log("Devices page: this.orgDevices: ",this.orgDevices);
      });

      this.lastNetId = this.net.id;

    }

  }






    setFilteredOrgs() {
      /*
      this.filteredDevices = this.orgDevices;


      let filtered = this.orgDevices.filter((item) => {
          console.log("setFilteredOrgs item",item);
          return item.serial.toUpperCase().indexOf(this.searchTerm.toUpperCase()) > -1;
      });

      let filteredUnclaimed = filtered.filter((item) => {
          console.log("setFilteredOrgs unclaimed",item);
          return item.claimedAt.indexOf(null) > -1;
      });
      */


      this.filteredDevices = this.orgDevices.filter((item) => {
        if(!item.networkId){
          if (item.serial.toUpperCase().indexOf(this.searchTerm.toUpperCase()) > -1){
              return true;
          }
          if (item.model.indexOf(this.searchTerm.toUpperCase()) > -1) {
            return true;
          }
          return false;
        }
      });

      /*
      this.filteredDevices = this.orgDevices.filter(function (el) {

        return el.serial.toUpperCase().indexOf(this.searchTerm.toUpperCase()) > -1 ||
               el.model.toUpperCase().indexOf(this.searchTerm.toUpperCase()) > -1) &&
               el.claimedAt < 1;
      });
      */


      console.log("setFilteredOrgs this.filteredDevices",this.filteredDevices);

      // update device list
      //this.filteredDevices = filtered;
      //this.filteredDevices = filteredUnclaimed;

      // set first item of array as selected serial
      /*
      if(typeof this.filteredDevices !== 'undefined' && this.filteredDevices.length > 0){
        this.serial = this.filteredDevices[0].serial;
      }
      */


   }


  orgDeviceSelected(device){
    console.log("orgDeviceSelected device ",device);
    this.serial = device;
  }

  scan(){
    this.barcodeScanner.scan().then((barcodeData) => {
     // Success! Barcode data is here
     this.serial = barcodeData.text;
     console.log("scan data", barcodeData);
    }, (err) => {
        // An error occurred
    });
  }

  claim(){
    this.message = "Sending serial: " + this.serial;
    this.merakiService.claimDevice(this.net.id, this.serial)
      .subscribe(
        data => {
          this.message = data;
          this.presentToast();
          console.log("claim-device claimDevice(this.serial).subscribe: data",this.message);
        },
        error => {
          this.message = error.errors || "Server Error, Invalid Data or Incorrect Org/Net";
          this.presentToast();
          console.log("claim-device this.message error: " + this.message +" :end of error");
         },
        ()  =>  console.log("Finished")
    );
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  itemTapped(event, device) {
    this.serial = device.serial;
  }

}
