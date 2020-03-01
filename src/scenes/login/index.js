import React, {Component} from 'react';
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Image,
} from 'react-native';
import {postLogin} from '_services';
import LinearGradient from 'react-native-linear-gradient';

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
    postLogin(this.state.username, this.state.password)
      .then(response => {
        this.setState({loggedIn: response.data.login}, () => {
          if (response.data.login) {
            this.props.navigation.navigate('Home', {
              isAdmin: response.data.isAdmin,
            });
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    <StatusBar hidden />;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../components/resources/login_background.png')}
          style={styles.backgroundImage}>
          <View style={styles.imageContainer}>
            <Image
              style={{width: 150, height: 100, resizeMode: 'contain'}}
              source={require('../../components/resources/logo.png')}
            />
          </View>
          <TextInput
            value={this.state.username}
            onChangeText={username => this.setState({username})}
            placeholder={'Username'}
            style={styles.textInput}
            returnKeyType={'done'}
          />

          <TextInput
            value={this.state.password}
            onChangeText={password => this.setState({password})}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.textInput}
            returnKeyType={'done'}
          />
          <View style={styles.loginView}>
            <LinearGradient
              colors={['#F6CF50', '#F6E3A3']}
              style={styles.linearGradient}>
              <Button
                title={'Login'}
                color={styles.loginView.color}
                fontSize={styles.loginView.fontSize}
                onPress={this.onLogin.bind(this)}
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
  imageContainer: {
    flexDirection: 'column',
    paddingLeft: 80,
    bottom: 100,
  },
  backgroundImage: {
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
    borderColor: 'white',
    borderBottomColor: '#414141',
    marginBottom: 10,
  },
  loginView: {
    position: 'absolute',
    bottom: 200,
    width: 200,
    alignSelf: 'center',
    color: '#414141',
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
