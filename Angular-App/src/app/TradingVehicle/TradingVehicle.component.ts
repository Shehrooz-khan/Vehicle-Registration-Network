/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TradingVehicleService } from './TradingVehicle.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-tradingvehicle',
  templateUrl: './TradingVehicle.component.html',
  styleUrls: ['./TradingVehicle.component.css'],
  providers: [TradingVehicleService]
})
export class TradingVehicleComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  vehicleId = new FormControl('', Validators.required);
  vehicleName = new FormControl('', Validators.required);
  vehicleDescription = new FormControl('', Validators.required);
  vehicleType = new FormControl('', Validators.required);
  forTrade = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);

  constructor(public serviceTradingVehicle: TradingVehicleService, fb: FormBuilder) {
    this.myForm = fb.group({
      vehicleId: this.vehicleId,
      vehicleName: this.vehicleName,
      vehicleDescription: this.vehicleDescription,
      vehicleType: this.vehicleType,
      forTrade: this.forTrade,
      owner: this.owner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceTradingVehicle.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.vehicle.network.TradingVehicle',
      'vehicleId': this.vehicleId.value,
      'vehicleName': this.vehicleName.value,
      'vehicleDescription': this.vehicleDescription.value,
      'vehicleType': this.vehicleType.value,
      'forTrade': this.forTrade.value,
      'owner': this.owner.value
    };

    this.myForm.setValue({
      'vehicleId': null,
      'vehicleName': null,
      'vehicleDescription': null,
      'vehicleType': null,
      'forTrade': null,
      'owner': null
    });

    return this.serviceTradingVehicle.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'vehicleId': null,
        'vehicleName': null,
        'vehicleDescription': null,
        'vehicleType': null,
        'forTrade': null,
        'owner': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.vehicle.network.TradingVehicle',
      'vehicleName': this.vehicleName.value,
      'vehicleDescription': this.vehicleDescription.value,
      'vehicleType': this.vehicleType.value,
      'forTrade': this.forTrade.value,
      'owner': this.owner.value
    };

    return this.serviceTradingVehicle.updateAsset(form.get('vehicleId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceTradingVehicle.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceTradingVehicle.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'vehicleId': null,
        'vehicleName': null,
        'vehicleDescription': null,
        'vehicleType': null,
        'forTrade': null,
        'owner': null
      };

      if (result.vehicleId) {
        formObject.vehicleId = result.vehicleId;
      } else {
        formObject.vehicleId = null;
      }

      if (result.vehicleName) {
        formObject.vehicleName = result.vehicleName;
      } else {
        formObject.vehicleName = null;
      }

      if (result.vehicleDescription) {
        formObject.vehicleDescription = result.vehicleDescription;
      } else {
        formObject.vehicleDescription = null;
      }

      if (result.vehicleType) {
        formObject.vehicleType = result.vehicleType;
      } else {
        formObject.vehicleType = null;
      }

      if (result.forTrade) {
        formObject.forTrade = result.forTrade;
      } else {
        formObject.forTrade = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'vehicleId': null,
      'vehicleName': null,
      'vehicleDescription': null,
      'vehicleType': null,
      'forTrade': null,
      'owner': null
      });
  }

}
