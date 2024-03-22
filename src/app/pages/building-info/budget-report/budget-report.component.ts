import { Component, OnInit } from '@angular/core';
import { BudgetReport } from 'src/app/models/properties';

@Component({
  selector: 'app-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.scss'],
})
export class BudgetReportComponent implements OnInit {
  fakeBudget: BudgetReport[] = [];

  public totalCondoFeeRevenue: number = 0;
  public totalOperationCosts: number = 0;
  public totalProfit: number = 0;

  constructor() {}

  ngOnInit() {
    // Generate fake budget data for 10 buildings
    for (let i = 1; i <= 10; i++) {
      const building: BudgetReport = {
        BuildingName: 'Building ' + String.fromCharCode(64 + i),
        CondoFeeRevenue: Math.floor(Math.random() * 1000) + 500,
        OperationCosts: Math.floor(Math.random() * 500) + 200,
      };

      building.Profit = building.CondoFeeRevenue - building.OperationCosts;

      // Update totals
      this.totalCondoFeeRevenue += building.CondoFeeRevenue;
      this.totalOperationCosts += building.OperationCosts;
      this.totalProfit += building.Profit;

      this.fakeBudget.push(building);
    }
  }
}
