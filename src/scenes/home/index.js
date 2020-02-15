import React, { Component } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import AdminScreen from '../admin_dashboard'
import SymptomsChecker from '../symptoms_checker';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSymptomsChecker: false,
    };
  }

  logOut() {
    this.props.navigation.navigate('Login');
  }

  showSymptomsChecker() {
    this.setState({ showSymptomsChecker: true });
  }

  render() {
    if (this.props.navigation.state.params.isAdmin) {
      return (
        <AdminScreen admin={this.props} />
      )
    }

    if (this.state.showSymptomsChecker) {
      return (
        <SymptomsChecker />
      )
    }

    return (
      <View style={styles.container}>
        <Button
          title={'Symptom Check'}
          color={styles.regularButton.color}
          onPress={this.showSymptomsChecker.bind(this)}
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
