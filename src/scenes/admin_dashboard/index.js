import React, { Component } from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import { SafeAreaView, FlatList } from 'react-navigation';
import { getConditionsPerUser } from '_services';
import { max } from 'react-native-reanimated';

function Item({data}) {
  return(
    <View style={styles.item}>
      <Text style={styles.title} key={data.key}>{data.key}</Text>
      <Text style={styles.conditionText}>Medical Conditions:</Text>
        {data.conditions.map(function(name, index) {
          return <Text key={index}>{name}</Text>;
        })}
    </View>
  );
}

export default class AdminScreen extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {};
  }

  componentDidMount() {
    getConditionsPerUser().then(response => {
      this.setState({
        conditionsPerUser: response.data.data
      });
    }).catch(err => {
      console.log(err);
    });
  }

  logOut() {
    this.props.admin.navigation.navigate('Login');
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Button
            title={'Log out'}
            color={styles.logOutButton.color}
            onPress={this.logOut}
            />
      
        <FlatList
          data={this.state.conditionsPerUser}
          renderItem={({ item }) => <Item data={item} />}
          keyExtractor={item => item.key}
          />
      </SafeAreaView>
    );
  }
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  logOutButton: {
    color: 'black',
  },
  conditionText:{
    fontSize: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    width: 350,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
