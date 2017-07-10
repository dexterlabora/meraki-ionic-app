import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

// Meraki Dashboard API Demo Pages
import { HomePage } from '../pages/home/home';
import { NetworksPage } from '../pages/networks/networks';
import { OrganizationsPage } from '../pages/organizations/organizations';
import { SsidsPage } from '../pages/ssids/ssids';
import { SsidDetailsPage } from '../pages/ssid-details/ssid-details';
import { InventoryPage } from '../pages/inventory/inventory';
import { LicensePage } from '../pages/license/license';
import { DevicesPage } from '../pages/devices/devices';
import { DeviceDetailsPage } from '../pages/device-details/device-details';
import { AdminsPage } from '../pages/admins/admins';
import { AdminDetailsPage } from '../pages/admin-details/admin-details';
import { ConfigTemplatesPage } from '../pages/config-templates/config-templates';
import { StaticRoutesPage } from '../pages/static-routes/static-routes';
import { VlansPage } from '../pages/vlans/vlans';
import { AddDevicesPage } from '../pages/add-devices/add-devices';
import { SettingsPage } from '../pages/settings/settings';
import { TrafficAnalysisPage } from '../pages/traffic-analysis/traffic-analysis';

// Meraki Organization and Network selector component
import { OrgNetSettings } from '../components/org-net-settings/org-net-settings';
import { ClaimDevice } from '../components/claim-device/claim-device';

// Custom Pages
import { AboutPage } from '../pages/about/about';

// Misc Pages
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Services and supporting modules
import { MerakiService} from '../services/meraki.service';
import { HttpModule } from "@angular/http";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NetworksPage,
    OrganizationsPage,
    SsidsPage,
    InventoryPage,
    LicensePage,
    OrgNetSettings,
    SsidDetailsPage,
    DevicesPage,
    DeviceDetailsPage,
    AdminsPage,
    AdminDetailsPage,
    ConfigTemplatesPage,
    StaticRoutesPage,
    VlansPage,
    AboutPage,
    ClaimDevice,
    AddDevicesPage,
    SettingsPage,
    TrafficAnalysisPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NetworksPage,
    OrganizationsPage,
    SsidsPage,
    SsidDetailsPage,
    InventoryPage,
    LicensePage,
    OrgNetSettings,
    DevicesPage,
    DeviceDetailsPage,
    AdminsPage,
    AdminDetailsPage,
    ConfigTemplatesPage,
    StaticRoutesPage,
    VlansPage,
    AboutPage,
    ClaimDevice,
    AddDevicesPage,
    SettingsPage,
    TrafficAnalysisPage
  ],
  providers: [
    StatusBar,
    BarcodeScanner,
    SplashScreen,
    MerakiService,
    [{provide: ErrorHandler, useClass: IonicErrorHandler}]
  ]
})
export class AppModule {}
