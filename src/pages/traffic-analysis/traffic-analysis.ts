import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
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
 // filteredTraffic: Array<any> = [];

  // Input Fields
  timespan: any;
  filter: any;

  legend: boolean = false;

  Math: any;

  @ViewChild('appReceivedCanvas') appReceivedCanvas;
  appReceivedChart: any;
  appReceivedData: any;

  @ViewChild('appSentCanvas') appSentCanvas;
  appSentChart: any;
  appSentData: any;



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public merakiService: MerakiService,
    public events: Events
    ) {
    this.merakiService.getCurrentNet().subscribe(data => {
      this.net = data;
      console.log("Traffic page getCurrentNet().subscribe: this.net",this.net);
    });

    this.timespan = 14400; //set default timespan
    this.filter = 10; // 10 applications
    this.Math = Math; // Extend native Math functions to template (for rounding, etc)

    events.subscribe('net:set', (net) => {
        console.log('home event: net updated', net);
        this.net = net;
        this.ionViewDidLoad();

    });
  }


  ionViewDidLoad() {
    this.merakiService.getTrafficAnalysis(this.net.id, this.timespan).subscribe(data => {
        this.traffic = data;
        this.refreshCharts();
    });

    this.appReceivedCanvas.onclick = (event) => {
      console.log("onclick() event",event);
      let activePoints = this.appReceivedChart.getElementsAtEvent(event);
      console.log("chartTapped() activePoints",activePoints);
      let url = activePoints[0].label + " value=" + activePoints[0].value;
      console.log("onclick() activePoints",activePoints);
    }

  }

  // Application Received Data Chart - Doughnut
  recvChart(element) {

    // Initialize arrays
    let data = [];
    let labels = [];
    let colors = [];

    // apply filter to source traffic data
    this.appReceivedData = this.traffic.sort(function(a, b) { return a.recv < b.recv ? 1 : -1; })
                .slice(0, this.filter);
    // add
    this.appReceivedData.forEach( item => {
      console.log('loading traffic item',item);
      labels.push(item.application + (item.destination === null ? "" : " : "+item.destination));
      data.push(Math.floor(item.recv/1024));
    });
    console.log("chartLabels", labels);
    console.log("chartData", data);

    // Set chart global options
    Chart.defaults.global.legend.display = this.legend;
    Chart.defaults.global.legend.onClick = (e, legendItem) =>{
        console.log("newLegendClickHandler e ",e);
        console.log("newLegendClickHandler legendItem ",legendItem);
    };

    // assign random background colors to each item
    for(let i = 0; i < data.length; i++){
      colors.push(this.getRandomColor());
    }

    // build chart
    this.appReceivedChart = new Chart(element, {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: [{
                  label: 'Top Received:'+this.filter  ,
                  data: data,
                  backgroundColor: colors,
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
              legendCallback: function(chart) {
                  "<i>testing</i>"
              }
            }
    });

  }

  sentChart(element) {

      // Initialize arrays
      let data = [];
      let labels = [];
      let colors = [];

      // apply filter to source traffic data
      this.appSentData = this.traffic.sort(function(a, b) { return a.sent < b.sent ? 1 : -1; })
                .slice(0, this.filter);

      // add data and labels
      this.appSentData.forEach( item => {
        console.log('loading traffic item',item);
        //labels.push(item.application);
        labels.push(item.application + (item.destination === null ? "" : " : "+item.destination));
        data.push(Math.floor(item.sent/1024));
      });
      console.log("chartLabels", labels);
      console.log("chartData", data);

      // Set chart global options
      Chart.defaults.global.legend.display = this.legend;

      // assign random background colors to each item
      for(let i = 0; i < data.length; i++){
        colors.push(this.getRandomColor());
      }

      // build chart
      this.appSentChart = new Chart(element, {
              type: 'doughnut',
              data: {
                labels: labels,
                datasets: [{
                    label: 'Top Sent:'+this.filter  ,
                    data: data,
                    backgroundColor: colors,
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

  // Utility Function - Random Color Generator
  getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }

  toggleLegend(){
    // charts to refresh (this.legend has been updated via ngModel)
      this.recvChart(this.appReceivedCanvas.nativeElement);
      this.sentChart(this.appSentCanvas.nativeElement);
  }

  refreshCharts(){
    this.merakiService.getTrafficAnalysis(this.net.id, this.timespan).subscribe(data => {
        // source data
        this.traffic = data;

        // charts to refresh
        this.recvChart(this.appReceivedCanvas.nativeElement);
        this.sentChart(this.appSentCanvas.nativeElement);
    });
  }



  chartTapped(event){
    console.log("chartTapped() event",event);
    //var activePoints = this.appReceivedChart.getElementsAtEvent(event);
    var activePoints = this.appReceivedChart.getPointsAtEvent(event);
    console.log("chartTapped() activePoints",activePoints);
    var url = activePoints[0].label + " value=" + activePoints[0].value;
    console.log("chartTapped() activePoints",activePoints);
  }


}
