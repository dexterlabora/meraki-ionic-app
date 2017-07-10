/*
This is a complete service for the Meraki Dashboard API.
The baseUrl is intended to point to a backend server that will actually make
the Meraki API calls. The structure is almost identical for consistensy
but this service includes some custom helper functions and bespoke workflows.

Written by Cory Guynn
www.InternetOfLEGO.com
developers.meraki.com

*/


import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject }    from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Storage } from '@ionic/storage';
import * as Configs from '../configs';


@Injectable()
export class MerakiService{
    http:any;
    baseUrl: string;
    apiKey: string;
    options: any;
    headers: any = new Headers;

    orgs: any;
    nets: any;
    org: any;
    net: any;


    // Track current settings as ReplaySubject Observables.
    private currentOrg = new ReplaySubject<{id: string, name: string}>();
    private currentNet = new ReplaySubject<{id: string, name: string}>();



    constructor(http:Http, private storage: Storage, public events: Events){
        this.http = http;

          // Set default request headers
        this.headers = new Headers({
          'Content-Type': 'application/json'
        });
        this.options = new RequestOptions({ headers: this.headers });

        this.setApiKey(Configs.configs.API_KEY);
        this.setUrl(Configs.configs.BASE_URL);

        // * Device Storage *

        storage.get('baseUrl').then((val) => {
          console.log('settings storage: baseUrl', val);
          if(val){
            this.setUrl(val);
          }
        });

        storage.get('apiKey').then((val) => {
            console.log('settings storage: apiKey', val);
            if(val){
              this.setApiKey(val);
            }

            if(this.apiKey){
              this.headers.append('x-cisco-meraki-api-key', this.apiKey);
            }

            this.initializeDefaults();
        });


    }

    //********************
    // Error Handler
    //********************

    handleError(error,source) {
        console.log("Meraki Service error source",source);
        console.error("Meraki Service error",error);
        //this.lastError = error.json().error;
        return Observable.throw(error.json().error || 'Server error',error);
    }

    initializeDefaults(){
      console.log("meraki.service initializeDefaults()")
      // Clean up code to not require bogus defaults. It causes unnecessary API calls, with errors in responses

      /*
      this.setCurrentOrg({
        id: "0",
        name: "unknown"
      });

      this.setCurrentNet({
        id: "0",
        name: "unknown"
      });
      */



      // Get initial organizations
      this.getOrgs().subscribe(
        data => {
          this.orgs = data;
          console.log("meraki.service: this.orgs: ",this.orgs);

          // set default org
          console.log("meraki.service setting default org = ",this.orgs[0]);
          this.setCurrentOrg(this.orgs[0]);

          // get networks after current org is determined
          console.log('meraki.service initializeDefaults getNets(this.orgs[0])',this.orgs[0]);
          if(this.orgs.length > 0){
            this.getNets(this.orgs[0]).subscribe(data => {
              this.nets = data;
              console.log("meraki.service: this.nets: ",this.nets);

              // set default net
              console.log("meraki.service initializeDefaults: this.net = ",this.net);
              this.setCurrentNet(this.nets[0]);
            },
            error => {
              console.log('this.getNets() error getting intial nets',error);
            });
          }
      },
      error => {
        console.log('this.getOrgs() error getting intial orgs',error);
      });


    }




    // Utility function for displaying keys in an object.
    keys(object: {}) {
      console.log("merakiService, keys(object) object = ",object);
      return Object.keys(object);
    }

// *****************************************************
// Meraki API Services (using backend server)
// *****************************************************

// Admins
    getAdmins(orgId) {
      return this.http.get(this.baseUrl+"/organizations/"+orgId+"/admins", this.options)
      .map((res:Response) => res.json())
      .catch(this.handleError);
    }

    createAdmin(orgId, admin) {
      let body = JSON.stringify(admin);
      return this.http.post(this.baseUrl+"/organizations/"+orgId+"/admins", body, this.options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    updateAdmin(orgId, data) {
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl+"/organizations/"+orgId+"/admins", body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    deleteAdmin(orgId, admin) {
      let body = JSON.stringify(admin);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.delete(this.baseUrl+"/organizations/"+orgId+"/admins", body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

// Clients
    getClients(serial, timespan) {
      // set default timespan ?
      return this.http.get(this.baseUrl + "/devices"+serial+"/clients?timespan="+timespan, this.options)
      .map((res:Response) => res.json())
      .catch(this.handleError);;
    }

// Config Templates
    getConfigTemplates(orgId) {
      return this.http.get(this.baseUrl+"/organizations/"+orgId+"/configTemplates", this.options)
      .map((res:Response) => res.json())
      .catch(this.handleError);;
    }

    deleteConfigTemplates(orgId, template) {
      let body = JSON.stringify(template);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.delete(this.baseUrl+"/organizations/"+orgId+"/configTemplates", body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

// Devices
    getDevices(netId) {
      return this.http.get(this.baseUrl+"/networks/"+netId+"/devices", this.options)
      .map((res:Response) => res.json())
      .catch(this.handleError);;
    }

    getDevice(netId, serial) {
      return this.http.get(this.baseUrl+"/networks/"+netId+"/devices"+serial, this.options)
      .map((res:Response) => res.json())
      .catch(this.handleError);;
    }

    updateDevice(netId, serial, data) {
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl+"/networks/"+netId+"/devices"+serial, body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    claimDevice(netId, serial) {
      let body = {"serial":serial}
      return this.http.post(this.baseUrl+"/networks/"+netId+"/devices/claim", body, this.options)
          .map(res => res.json())
          .catch((err:Response) => {
            let details = err.json();
            console.log("claimDevice error details:",details);
            return Observable.throw(details);
         });
    }

    removeDevice(netId, serial) {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseUrl+"/networks/"+netId+"/devices/"+serial+"/remove", options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    getDeviceUplinkStatus(netId, serial) {
      return this.http.get(this.baseUrl+"/networks/"+netId+"/devices"+serial+"/uplink", this.options)
      .map((res:Response) => res.json())
      .catch(this.handleError);;
    }
// L3 Firewall Rules (wireless)
    getL3FirewallRules(netId, ssidNum){
      return this.http.get(this.baseUrl+"/networks/"+netId+"/ssids"+ssidNum+"/l3FirewallRules", this.options)
      .map((res:Response) => res.json())
      .catch(this.handleError);;
    }

    updateL3FirewallRule(netId, ssidNum) {
      /*
      {"rules":[{
      	"comment":"a note about the rule",
      	"policy":"deny",
      	"protocol":"tcp",
      	"destPort":"any",
      	"destCidr":"192.168.1.0/24"
      }],
      	"allowLanAccess":true}
      */
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseUrl+"/networks/"+netId+"/ssids"+ssidNum+"/l3FirewallRules", options)
          .map(res => res.json())
          .catch(this.handleError);
    }
// Networks
    getNets(orgId) {
      return this.http.get(this.baseUrl+"/organizations/"+orgId+"/networks", this.options)
      .map((res:Response) => res.json());

    }

    getNet(netId) {
      return this.http.get(this.baseUrl+"/networks/"+netId, this.options)
      .map((res:Response) => res.json())
      .catch(this.handleError,'getNet');
    }

    updateNet(netId) {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl+"/networks/"+netId, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    createNet(orgId) {
      /*
          "name": "API Test - Home",
          "timeZone": "Europe/Amsterdam",
          "tags": "test",
          "type": "wireless"
        }
      */
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl+"/organizations/"+orgId+"/networks", options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    deleteNet(netId) {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl+"/networks/"+netId, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    bindTemplate(netId) {
      /*
      {
        "configTemplateId":"{{templateId}}",
        "autoBind": false
      }
      */
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseUrl+"/networks/"+netId+"/bind", options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    unbindTemplate(netId){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseUrl+"/networks/"+netId+"/unbind", options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    getSiteVPN(netId) {
      return this.http.get(this.baseUrl + "/networks/"+netId+"/siteToSiteVpn", this.options )
      .map((res:Response) => res.json())
      .catch(this.handleError);;
    }

    updateSiteVPN(netId) {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl + "/networks/"+netId+"/siteToSiteVpn", options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    getTrafficAnalysis(netId, timespan){
      timespan = timespan || 14400;
      return this.http.get(this.baseUrl + "/networks/"+netId+"/traffic?timespan="+timespan, this.options )
      .map((res:Response) => res.json())
      .catch(this.handleError);;
    }

    // MS access policies
    getAccessPolicies(netId){
      return this.http.get(this.baseUrl + "/networks/"+netId+"/accessPolicies", this.options)
      .map((res:Response) => res.json())
      .catch(this.handleError);;
    }

    getAirMarshal(netId, timespan){
      timespan = timespan || 3600
      return this.http.get(this.baseUrl + "/networks/"+netId+"/airMarshal", this.options)
      .map((res:Response) => res.json())
      .catch(this.handleError);;
    }

// Organizations
    getOrgs() {
      return this.http.get(this.baseUrl + "/organizations", this.options )
      .map((res:Response) => res.json())
      .catch(this.handleError,'getOrgs');
    }

    getOrg(orgId) {
      return this.http.get(this.baseUrl + "/organizations/"+orgId, this.options )
      .map((res:Response) => res.json())
      .catch(this.handleError,'getOrg');
    }

    updateOrg(orgId, data) {
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl + "/organizations/"+orgId, body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    createOrg(orgId, data) {
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseUrl + "/organizations/", body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    cloneOrg(orgId, data) {
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseUrl + "/organizations/"+orgId+"/clone", body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

      // possibly rename this. It claims an order or a serial/license
    claimOrder(orgId, data) {
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseUrl + "/organizations/"+orgId+"/claim", body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    getLicenseState(orgId) {
      return this.http.get(this.baseUrl+"/organizations/"+orgId+"/licenseState", this.options)
      .map((res:Response) => res.json());
    }

    getInventory(orgId) {
      console.log("merakiService: getInventory = ", orgId);
      return this.http.get(this.baseUrl+"/organizations/"+orgId+"/inventory", this.options)
      .map((res:Response) => res.json());
    }

    getSNMP(orgId) {
      console.log("merakiService: getInventory = ", orgId);
      return this.http.get(this.baseUrl+"/organizations/"+orgId+"/snmp", this.options)
      .map((res:Response) => res.json());
    }

    // VERIFY THIS URL, JUST GUESSING!!
    getThirdPartyVPN(orgId) {
      console.log("merakiService: getThirdPartyVPN = ", orgId);
      return this.http.get(this.baseUrl+"/organizations/"+orgId+"/vpn", this.options)
      .map((res:Response) => res.json());
    }

    // VERIFY THIS URL, JUST GUESSING!!
    updateThirdPartyVPN(orgId, data) {
      /* data sample
      [{
        	"name":"Your peer",
        	"publicIp":"192.168.0.1",
        	"privateSubnets":[
        		"172.168.0.0/16",
        		"172.169.0.0/16"
        		],
        	"secret":"asdf1234"
        }]
      */
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl + "/organizations/"+orgId+"/vpn", body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

// SAML Roles
    getSamlRoles(orgId) {
      return this.http.get(this.baseUrl+"/organizations/"+orgId+"/samlRoles", this.options)
      .map((res:Response) => res.json());
    }

    getSamlRole(orgId, samlId) {
      return this.http.get(this.baseUrl+"/organizations/"+orgId+"/samlRoles/"+samlId, this.options)
      .map((res:Response) => res.json());
    }

    updateSamlRole(orgId, samlId, data) {
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl+"/organizations/"+orgId+"/samlRoles"+samlId, body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    createSamlRole(orgId, samlId, data) {
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseUrl+"/organizations/"+orgId+"/samlRoles", body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    deleteSamlRole(orgId, samlId) {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.delete(this.baseUrl+"/organizations/"+orgId+"/samlRoles"+samlId, options)
          .map(res => res.json())
          .catch(this.handleError);
    }




// SSIDs
    getSsids(netId) {
      console.log("merakiService: getSsids: netId = ", netId);
      return this.http.get(this.baseUrl+"/networks/"+netId+"/ssids", this.options)
      .map((res:Response) => res.json());
    }

    getSsid(netId, ssidNum) {
      console.log("merakiService: getSsid: netId = ", netId);
      return this.http.get(this.baseUrl+"/networks/"+netId+"/ssids"+ssidNum, this.options)
      .map((res:Response) => res.json());
    }

    updateSsid(netId, ssidNum, data) {
      /* SAMPLE DATA *
      {
        "name": "viaIonic",
        "enabled": false,
        "splashPage": "None",
        "perClientBandwidthLimitUp": 0,
        "perClientBandwidthLimitDown": 0,
        "ssidAdminAccessible": false,
        "ipAssignmentMode": "NAT mode",
        "authMode": "open"
      }
      */
      //let body = JSON.stringify(data);
      //let headers = new Headers({ 'Content-Type': 'application/json' });
      //let options = new RequestOptions({ headers: headers });

      console.log(this.baseUrl+"/networks/"+netId+"/ssids/"+ssidNum);
      console.log("MerakiService updateSsid #",ssidNum + " : ", data);


      return this.http.put(this.baseUrl+"/networks/"+netId+"/ssids/"+ssidNum, data, this.options)
          .map((res:Response) => res.json())
          .catch(this.handleError);

    }

// Static Routes
    getStaticRoutes(netId) {
      return this.http.get(this.baseUrl+"/networks/"+netId+"/staticRoutes", this.options)
      .map((res:Response) => res.json())
      .catch(this.handleError);
      /*
      .subscribe(
        data => console.log("getStaticRoutes data",data),
        err => console.log("getStaticRoutes err",err),
        () => console.log('yay')
      );
      */
    }

    getStaticRoute(netId, srId) {
      return this.http.get(this.baseUrl+"/networks/"+netId+"/staticRoutes/"+srId, this.options)
      .map((res:Response) => res.json());

    }

    // Verify Static Route URLs
    updateStaticRoute(netId, srId, data) {
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl+"/networks/"+netId+"/staticRoutes/"+srId,body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    createStaticRoute(netId, srId, data) {
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseUrl+"/networks/"+netId+"/staticRoutes/",body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    deleteStaticRoute(netId, srId) {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.delete(this.baseUrl+"/networks/"+netId+"/staticRoutes/"+srId, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

// Switch Ports
    getSwitchPorts(serial) {
      return this.http.get(this.baseUrl+"/devices/"+serial+"/switchPorts/", this.options)
      .map((res:Response) => res.json());
    }

    getSwitchPort(serial, portNum) {
      return this.http.get(this.baseUrl+"/devices/"+serial+"/switchPorts/"+portNum, this.options)
      .map((res:Response) => res.json());
    }

    updateSwitchPort(serial, portNum, data) {
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl+"/devices/"+serial+"/switchPorts/"+portNum, body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }


// VLANs
    getVlans(netId) {
      return this.http.get(this.baseUrl+"/networks/"+netId+"/vlans", this.options)
      .map((res:Response) => res.json());
    }

    getVlan(netId, vlanId) {
      return this.http.get(this.baseUrl+"/networks/"+netId+"/vlans"+vlanId, this.options)
      .map((res:Response) => res.json());
    }

    updateVlan(netId, vlanId, data){
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.put(this.baseUrl+"/networks/"+netId+"/vlans/"+vlanId, body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    createVlan(netId, data){
      let body = JSON.stringify(data);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.baseUrl+"/networks/"+netId+"/vlans/", body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    deleteVlan(netId,vlanId){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.delete(this.baseUrl+"/networks/"+netId+"/vlans/"+vlanId, options)
          .map(res => res.json())
          .catch(this.handleError);
    }



//*********************
// Setters and Getters for global variables & settings
//*********************
//    this.merakiService.setUrl(this.url);
//    this.merakiService.setApiKey(this.apiKey);

    setUrl(url){
      this.baseUrl = url;
      this.storage.set('baseUrl', url);
      return true;
    }

    getUrl(){
      return this.baseUrl;
    }


    setApiKey(key){
      this.apiKey = key;
      this.storage.set('apiKey', key);
      this.headers.append('x-cisco-meraki-api-key', this.apiKey); //verify this logic
      return true;
    }

    getApiKey(){
      console.log("meraki.service: getApiKey",this.apiKey);
      return this.apiKey;
    }

    setCurrentOrg(org){
      console.log("Meraki Service: setCurrentOrg",org);
      //this.currentOrg = org;
      this.currentOrg.next(org);
      this.events.publish('org:set', org);
      //this.settings.next({org});
      return true;
    }

    setCurrentNet(net){
      console.log("Meraki Service: setCurrentNet",net);
      this.currentNet.next(net);
      this.events.publish('net:set', net, Date.now());
      return true;
      //this.settings.next({net});
    }

    getCurrentOrg(){
      console.log("Meraki Service: getCurrentOrg.asObservable()",this.currentOrg);
      console.log("Meraki Service: getCurrentOrg",this.currentOrg);
      return this.currentOrg.asObservable();
      //return this.settings['org'].asObservable();
    }

    getCurrentNet(){
      console.log("Meraki Service: getCurrentNet",this.currentNet);
      return this.currentNet.asObservable();
      //return this.settings['net'].asObservable();
    }

}
