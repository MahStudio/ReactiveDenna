import React, {Component} from 'react';
import {View, Text, FlatList, Button} from 'react-native';
import {openRealm} from './realm';

class DemoList extends Component {
  constructor(props) {
    super(props);

    // This is the local state. a React component "reacts" (ah ah, get it?)
    // when the state changes. We will use it to tell the component to re-render
    // when the data changes.
    this.state = {
      // This is the actual list of cars used.
      cars: []
    };

    this.onAddCarClick = this.onAddCarClick.bind(this);
    this.onRemoveAllClick = this.onRemoveAllClick.bind(this);
    this.updateLocalCarState = this.updateLocalCarState.bind(this);
  }

  // This is run only ONCE automatically when the component is mounted.
  // Whe need the list of cars when the component starts, right?
  componentDidMount() {
    this.updateLocalCarState();
  }

  // Function triggered when the "Add car" button is pressed.
  onAddCarClick() {
    openRealm().then(realmInstance => {
      realmInstance.write(() => {
        // Create a new car.
        const myCar = realmInstance.create('Car', {
          make: 'Honda',
          model: 'Civic',
          miles: 1000,
        });
      });

      // Now that the Realm DB is updated, ask the component to query again.
      this.updateLocalCarState();
    });
  }

  // Function triggered when the "Remove all" button is pressed.
  onRemoveAllClick() {
    openRealm().then(realmInstance => {
      realmInstance.write(() => {
        // Get a reference to the Car table and delete it.
        const cars = realmInstance.objects('Car');
        realmInstance.delete(cars);
      });

      // Now that the Realm DB is updated, ask the component to query again.
      this.updateLocalCarState();
    });
  }

  // Query the Realm database and update the local state.
  updateLocalCarState() {
    openRealm().then(realmInstance => {
      // Get a reference to the Car table.
      const cars = realmInstance.objects('Car');

       // Update the local state with the new car list.
       this.setState({
         cars: cars,
       });
    });
  }

  // This function is run EVERY TIME the local state is updated.
  render() {
    return (
      <View style={{ width: '100%' }}>
        <FlatList
          data={this.state.cars}
          renderItem={(car) => <Text key={car.index}>{`${car.item.make} - ${car.item.model}`}</Text>}
          ListEmptyComponent={() => <Text>No cars available :(</Text>}
        />
        <Button title='Add a car' onPress={this.onAddCarClick} />
        <Button title='Remove all cars' onPress={this.onRemoveAllClick} />
      </View>
    );
  }
}

export default DemoList;