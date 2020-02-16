import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet } from 'react-native';
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
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
          returnKeyType={'done'}
        />

        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
          returnKeyType={'done'}
        />
        
        <Button
          title={'Login'}
          style={styles.input}
          onPress={this.onLogin.bind(this)}
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
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
