import React, {Component} from 'react';
import {Button, View, StyleSheet, ImageBackground, StatusBar, Text} from 'react-native';
import AdminScreen from '../admin_dashboard';
import SymptomsBot from '../symptoms_bot';
import {SafeAreaView} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

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
    this.setState({showSymptomsChecker: true});
  }

  render() {
    <StatusBar hidden />
    if (this.props.navigation.state.params.isAdmin) {
      return <AdminScreen admin={this.props} />;
    }

    if (this.state.showSymptomsChecker) {
      return (
        <SafeAreaView style={styles.container}>
          <SymptomsBot />
        </SafeAreaView>
      );
    }

    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../components/resources/app_background.png')}
          style={styles.backgroundImage}>
          <View style={styles.titleView}>
          <Text
          title={'Home'}
          color={styles.titleView.color}>
          </Text>
          </View>
          <View style={styles.symptomCheckView}>
            <LinearGradient
              colors={['#28B6D1', '#28B6D1']}
              style={styles.linearGradient}>
              <Button
                title={'Symptom Check'}
                color={styles.regularButton.color}
                onPress={this.showSymptomsChecker.bind(this)}
              />
            </LinearGradient>
          </View>
          <View style={styles.logOutView}>
            <LinearGradient
              colors={['#28B6D1', '#28B6D1']}
              style={styles.linearGradient}>
              <Button
                title={'Log out'}
                color={styles.logOutButton.color}
                onPress={this.logOut.bind(this)}
              />
            </LinearGradient>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleView: {
    height: 100,
    width: 100,
    color: 'black',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  linearGradient: {
    height: 100,
    width: 300,
    paddingLeft: 10,
    paddingRight: 15,
    borderRadius: 15,
    justifyContent: 'center',
  },
  symptomCheckView: {
    paddingTop: 15,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  regularButton: {
    alignSelf: 'center',
    color: 'white',
  },
  logOutView: {
    paddingTop: 15,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logOutButton: {
    alignSelf: 'center',
    color: 'white',
  },
});
