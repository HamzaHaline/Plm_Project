
const cartData = [
  {ingredientName: " salt ", packageNum: 500, vendors:" "} ,
  {ingredientName: " pepper ", packageNum: 10, vendors:" "} ,
  {ingredientName: " milk ", packageNum: 20, vendors:" "} ,
];

const ingredientData = [
  {name: "salt",packageName: "sack",temperatureZone: "warehouse",
  vendors: [{vendorId: "ID1", vendorName: "Target", price: 50},
  {vendorId: "ID2", vendorName: "Li Ming", price: 15},]},
  {name: "pepper",packageName: "supersack",temperatureZone: "freezer",
  vendors: [{vendorId: "ID3", vendorName: "Harris Teeters", price: 25},
  {vendorId: "ID4", vendorName: "Sugars", price: 10},]},
  {name: "milk",packageName: "gallon",temperatureZone: "refrigerator",
  vendors: [{vendorId: "ID5", vendorName: "WholeFoods", price: 5},
  {vendorId: "ID6", vendorName: "Krogers", price:5},]},
];

export   {cartData, ingredientData};
