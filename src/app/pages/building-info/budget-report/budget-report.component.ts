import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BudgetReport, Building, Condo, CondoStatus } from 'src/app/models/properties';
import { BuildingService } from 'src/app/services/building.service';


import { DatabaseReference,
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query,
  ref,
  onValue,} from 'firebase/database';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.scss'],
})
// export class BudgetReportComponent implements OnInit {
//   budgetReports: BudgetReport[] = [];
//   buildings: Building[] = [];

//   // public totalCondoFeeRevenue: number = 0;
//   public totalOperationCosts: number = 0;
//   // public totalProfit: number = 0;

//   constructor(
//     private buildingService: BuildingService,
//     private authService: AuthService
//   ) {}

//   ngOnInit() {
//     // Fetch buildings for the current company 
//     const currentUser = this.authService.getUser();
//     if (currentUser) {
//       this.buildingService.getAllBuildingsOfCompany(currentUser.uid)
//         .then((buildings) => {
//           this.buildings = buildings;
//           this.calculateBudgetReports();
//         })
//         .catch((error) => {
//           console.error('Error fetching buildings:', error);
//         });
//       }

//     // Generate fake budget data for 10 buildings
//     // for (let i = 1; i <= 10; i++) {
//     //   const building: BudgetReport = {
//     //     BuildingName: 'Building ' + String.fromCharCode(64 + i),
//     //     CondoFeeRevenue: Math.floor(Math.random() * 1000) + 500,
//     //     OperationCosts: Math.floor(Math.random() * 500) + 200,
//     //   };

//     //   building.Profit = building.CondoFeeRevenue - building.OperationCosts;

//     //   // Update totals
//     //   this.totalCondoFeeRevenue += building.CondoFeeRevenue;
//     //   this.totalOperationCosts += building.OperationCosts;
//     //   this.totalProfit += building.Profit;

//     //   this.BudgetReport.push(building);
//     // }
//   }

//   calculateBudgetReports() {
//     this.budgetReports = this.buildings.map((building) => {
//       const condoFeeRevenue = this.calculateCondoFeeRevenue(building);
//       const operationCosts = this.calculateOperationCosts(building);
//       const profit = condoFeeRevenue - operationCosts;

//       return {
//         BuildingName: building.Name,
//         CondoFeeRevenue: condoFeeRevenue,
//         OperationCosts: operationCosts,
//         Profit: profit,
//       };
//     });
//   }

//   calculateCondoFeeRevenue(building: Building): number {
//     let condoFeeRevenue = 0;
//     building.Condos.forEach((condo) => {
//       if (condo.Status === CondoStatus.Owned || condo.Status === CondoStatus.Rented) {
//         condoFeeRevenue += condo.Fee;
//       }
//     });
//     return condoFeeRevenue;
//   }

//   calculateOperationCosts(building: Building): number {
//     // Implement your logic to calculate operation costs for the building
//     // For now, return a random value
//     return Math.floor(Math.random() * 500) + 200;
//   }
// }
export class BudgetReportComponent implements OnInit {
  buildings: Building[] = [];
  fakeBudget: any[] = []; // Update the type of fakeBudget array

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
  
      // Push the BudgetReport object to the fakeBudget array
      this.fakeBudget.push(budgetReport);
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
    // For now, just return a random number
    return Math.floor(Math.random() * 500) + 200;
  }
}
