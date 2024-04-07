import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BudgetReport, Building, Condo, CondoStatus } from 'src/app/models/properties';
import { BuildingService } from 'src/app/services/building.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.scss'],
})

export class BudgetReportComponent implements OnInit {
  buildings: Building[] = [];
  Budget: any[] = [];

  totalCondoFeeRevenue: number = 0;
  totalOperationCosts: number = 0;
  totalProfit: number = 0;

  constructor(
    private buildingService: BuildingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.uid) {
      this.buildingService.getAllBuildingsOfCompany(currentUser.uid)
        .then((buildings: Building[]) => {
          this.buildings = buildings;
          this.generateBudgetReport();
        })
        .catch((error) => {
          console.error('Error getting buildings:', error);
        });
    }
  }

  generateBudgetReport() {
    for (let i = 0; i < this.buildings.length; i++) {
      const building = this.buildings[i];
      const condoFeeRevenue = this.calculateCondoFeeRevenue(building);
      const operationCosts = this.calculateOperationCosts(building);
      const profit = condoFeeRevenue - operationCosts;
  
      // Create a BudgetReport object with the calculated data
      const budgetReport: BudgetReport = {
        BuildingName: building.Name,
        CondoFeeRevenue: condoFeeRevenue,
        OperationCosts: operationCosts,
        Profit: profit,
      };
  
      // Update totals
      this.totalCondoFeeRevenue += condoFeeRevenue;
      this.totalOperationCosts += operationCosts;
      this.totalProfit += profit;
  
      // Push the BudgetReport object to the Budget array
      this.Budget.push(budgetReport);
    }
  }

  calculateCondoFeeRevenue(building: Building): number {
    let condoFeeRevenue = 0;
    for (const condo of building.Condos) {
      if (condo.Status === CondoStatus.Owned || condo.Status === CondoStatus.Rented) {
        condoFeeRevenue += condo.Fee;
      }
    }
    return condoFeeRevenue;
  }

  calculateOperationCosts(building: Building): number {
    let operationCosts = 0;
    if (building.Operations){
      for (const operation of building.Operations){
        operationCosts += operation.cost;
      }
    }
    return operationCosts;
  }
}
