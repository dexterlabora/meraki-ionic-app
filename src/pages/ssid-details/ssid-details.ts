import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';


//@IonicPage()
@Component({
  selector: 'page-ssid-details',
  templateUrl: 'ssid-details.html',
})
export class SsidDetailsPage {
  net: any;
  ssid: any;
  ssidToggle: boolean;
  message: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public merakiService: MerakiService,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController
    ) {
    this.merakiService.getCurrentNet().subscribe(data => {
      this.net = data;
      console.log("ssid-details getCurrentNet().subscribe: this.net",this.net);
    });

    this.ssid = navParams.get('ssid');
  }



  updatePsk() {
    let prompt = this.alertCtrl.create({
      title: 'Change PSK',
      message: "Enter a new pre-shared key",
      inputs: [
        {
          name: 'psk',

          value: this.ssid.psk
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            console.log('data ',data);
            console.log("ssid ",this.ssid);
            this.ssid.psk = data.psk;
            this.update(data);
          }
        }
      ]
    });
    prompt.present();
  }

  updateName() {
    let prompt = this.alertCtrl.create({
      title: 'Name',
      message: "Enter a new SSID name",
      inputs: [
        {
          name: 'name',

          value: this.ssid.name
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            console.log('data ',data);
            console.log("ssid ",this.ssid);
            this.ssid.psk = data.psk;
            this.update(data);
          }
        }
      ]
    });
    prompt.present();
  }

  toggleEnabled(data: boolean){
    console.log('toggleEnabled',data);
    this.ssid.enabled = data;
    this.update({'enabled': data});
  }

  toggleVlanTagging(data: boolean){
    console.log('toggleEnabled',data);
    this.ssid.useVlanTagging = data;

    // If Enabled, assign default VLAN and commit changes
    if(data){
      this.update({
        'useVlanTagging': "true",
        'defaultVlanId': 1
      });
    }else{
      this.update({
        'useVlanTagging': "false"
      });
    }

  }

  updateDefaultVlanId(){
    let prompt = this.alertCtrl.create({
      title: 'Default VLAN ID',
      message: "Enter the Default VLAN ID",
      inputs: [
        {
          name: 'defaultVlanId',

          value: this.ssid.defaultVlanId
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            console.log('data ',data);
            console.log("ssid ",this.ssid);
            this.ssid.defaultVlanId = data.defaultVlanId;
            this.update(data);
          }
        }
      ]
    });
    prompt.present();
  }

  updateIpAssignmentMode(){
    let alert = this.alertCtrl.create();
    alert.setTitle('IP Assignment');
    alert.addInput({
      type: 'radio',
      label: 'NAT mode',
      value: 'NAT mode',
      checked: this.ssid.ipAssignmentMode == 'NAT mode'
    });

    alert.addInput({
      type: 'radio',
      label: 'Bridge mode',
      value: 'Bridge mode',
      checked: this.ssid.ipAssignmentMode == 'Bridge mode'
    });

    // there are other possible input selections, such as VPN, but they were left out for simplicity.

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log('ipAssignmentMode data',data);
        this.update({'ipAssignmentMode':data})
      }
    });
    alert.present();
  }

  updateAuth() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Authentication');
    // 'open', 'psk', 'open-with-radius', '8021x-meraki', '8021x-radius'
    //this.ssid.authMode
    alert.addInput({
      type: 'radio',
      label: 'Open',
      value: 'open',
      checked: this.ssid.authMode == 'open'
    });

    alert.addInput({
      type: 'radio',
      label: 'PSK',
      value: 'psk',
      checked: this.ssid.authMode == 'psk'
    });

    alert.addInput({
      type: 'radio',
      label: 'Open with RADIUS',
      value: 'open-with-radius',
      checked: this.ssid.authMode == 'open-with-radius'
    });

    alert.addInput({
      type: 'radio',
      label: '802.1X Meraki',
      value: '8021x-meraki',
      checked: this.ssid.authMode == '8021x-meraki'
    });

     alert.addInput({
      type: 'radio',
      label: '802.1X RADIUS',
      value: '8021x-radius',
      checked: this.ssid.authMode == '8021x-radius'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log('updateAuth data',data);
        //this.testRadioOpen = false;
        //this.testRadioResult = data;
        if(data == 'psk'){
          this.ssid.encryptionMode = 'wpa'// hardcoding default with psk
          this.update({
            'authMode':data,
            'encryptionMode' : this.ssid.encryptionMode
          })
        }else{
          this.update({
            'authMode':data,
          });
        }

      }
    });
    alert.present();
  }

  updateTags(){
    // To Do
  }

  updateBandSelection(){
    // To Do
    // Dual band operation, 5 GHz band only, Dual band operation with Band Steering
    let alert = this.alertCtrl.create();
    alert.setTitle('Band Selection');
    alert.addInput({
      type: 'radio',
      label: 'Dual Band Operation',
      value: 'Dual band operation',
      checked: this.ssid.bandSelection == 'Dual band operation'
    });

    alert.addInput({
      type: 'radio',
      label: '5 GHz Band Only',
      value: '5 GHz band only',
      checked: this.ssid.authMode == '5 GHz band only'
    });

    alert.addInput({
      type: 'radio',
      label: 'Dual Band with Steering',
      value: 'Dual band operation with Band Steering',
      checked: this.ssid.authMode == 'Dual band operation with Band Steering'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log('updateBandSelection data',data);
        this.update({
          'bandSelection':data
        });
      }
    });
    alert.present();
  }

  updateMinBitrate(){
    // To Do
  }

  updateBandwidthLimitUp(){
    // To Do
  }

  updateBandwidthLimitDown(){
    // To Do
  }

  updateCaptivePortal(){
    // To Do
  }

  updateAdminAccess(){
    // To Do
  }

  // Sends updates to Meraki
  update(data){
    console.log('Updating SSID: data',data);
    this.message = "Updating SSID: " + this.ssid.name;
    this.presentToast();
    this.merakiService.updateSsid(this.net.id, this.ssid.number, data)
      .subscribe(
        data => {
          this.message = "Changes Saved! ";
          this.presentToast();
          console.log("SSID Updated",data);
          this.ssid = data;
        },
        error => {
          this.message = error.errors || "Server Error or Invalid Data";
          this.presentToast();
          console.log("SSID Update ERROR: " + this.message +" :end of error");
         },
        ()  =>  console.log("Finished update")
    );
  }

  // **** Utility functions

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



  ionViewDidLoad() {
    // life cycle hook
  }




}
