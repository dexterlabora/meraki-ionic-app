import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
//import { Subject }    from 'rxjs/Subject';


@Injectable()
export class MerakiService{
    http:any;
    baseUrl: String;
    apiKey: String;
    org: {id: String, name: String};
    net: {id: String, name: String};
    orgId: String;
    netId: String;

    constructor(http:Http){
        this.http = http;
        //this.baseUrl = 'http://localhost:1880/meraki/api/'; // Node-RED
        this.baseUrl = 'https://dashboard.meraki.com/api/v0/'; // Meraki
        this.apiKey = 'be647eed3046542a895ea9ad07b7f7cef4c002de';
        this.orgId = '306267';
    }

    getPosts(category, limit){
        return this.http.get(this.baseUrl+'/'+category+'/top.json?limit='+limit)
            .map(res => res.json());
    }

    // Calling the Meraki  Node-RED API using GET method.
  getOrgs() {
    let headers = new Headers({
      'Content-Type': 'application/json' ,
      'X-Cisco-Meraki-API-Key': this.apiKey
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.baseUrl + "organizations", options)
    .map((res:Response) => res.json());
  }

  getNets(orgId) {
    return this.http.get(this.baseUrl+"organizations/"+this.org.id+"/networks")
    .map((res:Response) => res.json());
  }

  setOrg(org){
    this.org = org;
  }

  setNet(net){
    this.net = net;
  }
}
