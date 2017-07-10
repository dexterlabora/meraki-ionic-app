import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';

//@IonicPage()
@Component({
  selector: 'page-config-templates',
  templateUrl: 'config-templates.html',
})
export class ConfigTemplatesPage {
  configTemplates: any;
  org: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public merakiService: MerakiService) {
    this.merakiService.getCurrentOrg().subscribe(data => {
      this.org = data;
      console.log("ssids page getCurrentOrg().subscribe: this.org",this.org);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Config Templates');

    this.merakiService.getConfigTemplates(this.org.id).subscribe(data => {
      this.configTemplates = data;
      console.log("Config Templates page: this.configTemplates: ",this.configTemplates);
    });
  }

/*
  itemTapped(event, configTemplate) {
    this.navCtrl.push(ConfigTemplateDetailsPage, {
      configTemplate: configTemplate
    });
  }
  */

}
