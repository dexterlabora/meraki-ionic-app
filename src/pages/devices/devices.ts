import { Component, SimpleChanges } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';
import { AddDevicesPage } from '../add-devices/add-devices'
import { DeviceDetailsPage } from '../device-details/device-details'

//@IonicPage()
@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html',
})
export class DevicesPage {
  devices: any;
  net: any;

  lastNetId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public merakiService: MerakiService) {
    this.merakiService.getCurrentNet().subscribe(data => {
      this.net = data;
      console.log("ssids page getCurrentNet().subscribe: this.net",this.net);
    });

    this.merakiService.getDevices(this.net.id).subscribe(data => {
      this.devices = data;
      console.log("Devices page: this.devices: ",this.devices);
    });
    this.lastNetId = this.net.id;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad Devices');

  }

  ngDoCheck() {
    //console.log("devices ngDoCheck");
    //console.log("this.net.id: ",this.net.id);
    //console.log("this.lastNetId: ",this.lastNetId);

    // Update list if the Network ID has changed
    if(this.net.id != this.lastNetId){
      this.merakiService.getDevices(this.net.id).subscribe(data => {
        this.devices = data;
        //console.log("Devices page: this.devices: ",this.devices);
      });
      this.lastNetId = this.net.id;
    }

  }

  addDevice(){
    this.navCtrl.push(AddDevicesPage);
  }

  itemTapped(event, device) {
    this.navCtrl.push(DeviceDetailsPage, {
      device: device
    });
  }

}
