import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ChartComponent } from "ng-apexcharts";
import { ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexAxisChartSeries, ApexXAxis, ApexDataLabels, ApexTooltip, ApexStroke } from "ng-apexcharts";

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-trainer-myhome',
  templateUrl: './trainer-myhome.component.html',
  styleUrls: ['./trainer-myhome.component.css']
})
export class TrainerMyhomeComponent implements OnInit {
  showDashboardata: any;

  @ViewChild("donutChart") donutChart!: ChartComponent;
  @ViewChild("areaChart") areaChart!: ChartComponent;

  public donutChartOptions: Partial<DonutChartOptions>;
  public areaChartOptions: Partial<AreaChartOptions>;

  constructor(
    private service: DashboardService,
    private router: Router,
    private http: HttpClient
  ) {
    // Initialize Donut Chart Options
    this.donutChartOptions = {
      series: [15, 10, 7],
      chart: {
        type: "donut"
      },
      labels: ["Course", "Events", "Products"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    // Initialize Area Chart Options
    this.areaChartOptions = {
      series: [
        {
          name: "Series 1 ",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "Series 2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chart: {
        height: 300,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
  }

  ngOnInit(): void {
    this.service.getDashboardData().subscribe(result => {
      console.log(result);
      this.showDashboardata = result;
    });
  }

  fetchUserProfile(token: string) {
    const apiUrl = 'http://localhost:1000/api/linkedin/userinfo';
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get(apiUrl, { headers }).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => {
        console.error('Error fetching profile', error);
      }
    );
  }
}
