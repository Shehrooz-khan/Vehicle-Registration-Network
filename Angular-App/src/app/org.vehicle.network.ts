import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.vehicle.network{
   export class TradingVehicle extends Asset {
      vehicleId: string;
      vehicleName: string;
      vehicleDescription: string;
      vehicleType: VehicleType;
      forTrade: boolean;
      owner: Distributor;
   }
   export enum VehicleType {
      Fourwheel,
      Twowheel,
      threewheel,
   }
   export class Distributor extends Participant {
      licenseNo: string;
      DistributorName: string;
   }
   export class VehicleRegistration extends Transaction {
      Vehicle: TradingVehicle;
      newDistributor: Distributor;
   }
   export class TradeNotification extends Event {
      Vehicle: TradingVehicle;
   }
// }
