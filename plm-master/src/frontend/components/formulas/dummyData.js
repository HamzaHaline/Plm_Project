const formulaData = [
{_id: "ID1",name: " Formula1", description: " desc 1",unitsProvided: 20,
ingredients:[{_id: "IngID1", ingredientName:" SALT", quantity: 50},
{_id: "IngID2", ingredientName:" LEMON", quantity: 2},],},
{_id: "ID2",name: " Formula2", description: " desc 2",unitsProvided: 10,
ingredients:[{_id: "IngID3", ingredientName:" PEPPER", quantity: 40}],},
{_id: "ID3",name: " Formula 3", description: " desc 1",unitsProvided: 50,
ingredients:[{_id: "IngID3", ingredientName:" MILK", quantity: 30}],},
];


const reviewData = [
{ingredientId: "ID1",ingredientName: "salt", totalAmountNeeded: 500,currentUnit: 20,
delta:480},
{ingredientId: "ID2",ingredientName: "pepper", totalAmountNeeded: 10,currentUnit: 5,
delta:5},
{ingredientId: "ID1",ingredientName: "salt", totalAmountNeeded: 50,currentUnit: 30,
delta:0},];

export  {formulaData,reviewData};
