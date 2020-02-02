import React, { Component } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import AdminScreen from '../admin_dashboard'

export default class HomeScreen extends Component {
  logOut() {
    this.props.navigation.navigate('Login');
  }

  render() {
    if (this.props.navigation.state.params.isAdmin) {
      return (
        <AdminScreen admin={this.props}/>
      )
    }

    return (
      <View style={styles.container}>
        <Button
          title={'Symptom Check'}
          color={styles.regularButton.color}
        />
        <Button
          title={'Log out'}
          color={styles.logOutButton.color}
          onPress={this.logOut.bind(this)}
        />
      </View>
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
  regularButton: {
    color: '#f194ff',
  },
  logOutButton: {
    color: 'black',
  },
});
