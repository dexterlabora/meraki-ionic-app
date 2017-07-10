import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrgNetSettings } from './org-net-settings';

@NgModule({
  declarations: [
    OrgNetSettings,
  ],
  imports: [
    IonicPageModule.forChild(OrgNetSettings),
  ],
  exports: [
    OrgNetSettings
  ]
})
export class OrgNetSettingsModule {}
