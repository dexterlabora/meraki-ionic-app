import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MerakiService } from '../../services/meraki.service';
import { Chart } from 'chart.js';

//@IonicPage()
@Component({
  selector: 'page-traffic-analysis',
  templateUrl: 'traffic-analysis.html',
})
export class TrafficAnalysisPage {

  net: any;
  traffic: Array<any> = [];
  recvChart: {
    data: Array<any>,
    labels: Array<any>,
    colors: Array<any>
  }

  // Input Fields
  timespan: any;
  filter: any;
  Math: any;

  @ViewChild('appReceivedCanvas') appReceivedCanvas;
  doughnutChart: any;



  constructor(public navCtrl: NavController, public navParams: NavParams, public merakiService: MerakiService) {
    this.Math = Math;

    this.merakiService.getCurrentNet().subscribe(data => {
      this.net = data;
      console.log("Traffic page getCurrentNet().subscribe: this.net",this.net);
    });

    this.timespan = 14400; //set default timespan
    this.filter = 10; // 10 applications
    //this.traffic.push({"default":""});

  }


  ionViewDidLoad() {
    this.merakiService.getTrafficAnalysis(this.net.id, this.timespan).subscribe(data => {
        this.traffic = data;
        this.refreshCharts();
    });
  }

  appRecvChart(filter) {
    console.log("Traffic Analsysis page: traffic:", this.traffic);
    console.log("filter: ",filter);

    this.recvChart.data = this.traffic.sort(function(a, b) { return a.recv < b.recv ? 1 : -1; })
                .slice(0, filter);

    this.recvChart.data.forEach( item => {
      console.log('loading traffic item',item);
      this.recvChart.labels.push(item.application);
      this.recvChart.data.push(item.recv);
    });
    console.log("chartLabels", this.recvChart.labels);
    console.log("chartData", this.recvChart.data);
    Chart.defaults.global.legend.display = false;

    for(let i = 0; i < this.recvChart.data.length; i++){
      this.recvChart.colors.push(this.getRandomColor());
    }

    this.doughnutChart = new Chart(this.appReceivedCanvas.nativeElement, {
            type: 'doughnut',
            data: {
              labels: this.recvChart.labels,
              datasets: [{
                  label: 'Top:'+filter  ,
                  data: this.recvChart.data,
                  backgroundColor: this.recvChart.colors,
                  hoverBackgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                  ]
              }]
            },
            options: {

            }
    });

  }


  getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }



  refreshCharts(){
    this.merakiService.getTrafficAnalysis(this.net.id, this.timespan).subscribe(data => {
        this.traffic = data;
        this.appRecvChart(this.filter);
    });
  }


}
