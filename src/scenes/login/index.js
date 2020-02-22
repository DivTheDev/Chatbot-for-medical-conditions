import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, ImageBackground, } from 'react-native';
import { postLogin } from '_services';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      password: '',
      loggedIn: false,
    };
  }

  onLogin() {
    postLogin(this.state.username, this.state.password).then(response => {
      this.setState({ loggedIn: response.data.login }, () => {
        if (response.data.login) {
          this.props.navigation.navigate('Home', {
            isAdmin: response.data.isAdmin,
          });
        }
      });
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
      <ImageBackground source={require('../../components/resources/login_background.png')} style={styles.backgroundImage}>
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.textInput}
          returnKeyType={'done'}
        />

        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.textInput}
          returnKeyType={'done'}
        />
        <View style={styles.loginView}>
          <Button
          title={'Login'}
          color={styles.loginView.color}
          onPress={this.onLogin.bind(this)}
          />
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
  backgroundImage:{
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textInput: {
    marginLeft: 24,
    width: 200,
    height: 44,
    borderWidth: 1,
    textAlign: 'center',
    borderColor: 'black',
    marginBottom: 10,
  },
  loginView: {
    position: 'absolute',
    bottom: 200,
    alignSelf:'center',
    color: 'red',
  },
});
