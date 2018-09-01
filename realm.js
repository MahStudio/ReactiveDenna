import Realm from 'realm';

// Define your models and their properties
const CarSchema = {
  name: 'Car',
  properties: {
    make:  'string',
    model: 'string',
    miles: {type: 'int', default: 0},
  }
};


// Helper function that opens a Real instance with our car schema.
export function openRealm() {
  return Realm.open({schema: [CarSchema]});
}