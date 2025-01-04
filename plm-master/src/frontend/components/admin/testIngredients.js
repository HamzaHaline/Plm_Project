const data = {
    tablePage:{
    items: [

        {id : 0, name: "pepper",packageName: "sack",temperatureZone: "warehouse", vendors: null, isIntermediate:true},
        {id : 1, name: "salt",packageName: "sack",temperatureZone: "fridge", vendors: "vendor3/20, vendor4/30"},
        {id : 2, name: "oil",packageName: "pail",temperatureZone: "room", vendors: "target/35"},
        {id : 3, name: "chocolate",packageName: "sack",temperatureZone: "room", vendors: "vendor1/10, vendor2/20"},
        {id : 4, name: "milk",packageName: "sack",temperatureZone: "freezer", vendors: null, isIntermediate:true},
      ],

   vendor_options2 : [
          { value: 'vendor1', label: 'vendor1' },
          { value: 'vendor2', label: 'vendor2' },
          { value: 'vendor4', label: 'vendor4' },
          { value: 'vendor5', label: 'vendor5' },
          { value: 'vendor6', label: 'vendor6' },
          { value: 'vendor7', label: 'vendor7' },
          { value: 'vendor8', label: 'vendor8' },
          { value: 'vendor9', label: 'vendor9' },
          { value: 'vendor10', label: 'vendor10' }
       ],

  /* Replace with the data from the back end */
  ingredient_options : ['salt','pepper','cabbage','honey','lemons'],

  /* Replace with the data from the back end -- filtered based on ingredients */
   vendor_options : ['target','wholefoods','li ming','panera','harris teeters'],

  package_options: ['sack', 'pail', 'drum', 'supersack', 'truckload', 'railcar'],

   temperatureZone_options:['freezer', 'refrigerator', 'warehouse'],
   lots_test:[{id:0,ingredientId:"5a92c99dc517006df7437477", moneySpent: 30,name: "peprika",
            nativeUnit: "lbs", numUnit:50, numUnitPerPackage:34,numUnitString:"1 lbs",
            packageName:"pail",packageNameString:"pail (34 lbs)",space:1,
            temperatureZone:"warehouse",
            vendors:[{vendorName: "Vendor 1", price: 10},{vendorName: "Vendor 3", price: 10}],
            ingredientLots:[{numUnit:10,lotNumber:"A12"},{numUnit:40,lotNumber:"A13"}]}],
 },
};

export default data;
