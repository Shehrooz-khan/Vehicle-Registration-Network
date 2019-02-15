/**
 * Buy card transaction
 * @param {org.vehicle.network.VehicleRegistration} trade
 * @transaction
 */
async function buyVehicle(trade){
    if (trade.vehicle.forTrade){

        trade.vehicle.distributor= trade.newdistributor;
        return getAssetRegistry("org.vehicle.network.TradingVehicle").then(
        assetRegistry =>   {
            return assetRegistry.update(trade.vehicle); 
        }
        ).then(() =>{
            let event = getFactory().newEvent(
                "org.vehicle.network",
                "TradeNotification"
              );
               // Get a reference to the event specified in the modeling language
              event.vehicle = trade.vehicle;
              emit(event);
        });
        
    }
}