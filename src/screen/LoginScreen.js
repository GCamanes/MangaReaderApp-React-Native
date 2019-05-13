import React, { Component } from 'react';
import {
  Alert, TouchableOpacity, TextInput, ImageBackground,
  View, StyleSheet, ActivityIndicator, Text, Switch,
  StatusBar, Platform, BackHandler,
} from 'react-native';
import { AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../store/connect.action';
import { colors } from '../colors';
import { deviceSize} from '../size';
import { images } from '../images';

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 80,
  },
  inputView: {
    width: deviceSize.deviceWidth * 0.70,
    height: 130,
    marginRight: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginView: {
    width: deviceSize.deviceWidth * 0.20,
    height: deviceSize.deviceWidth * 0.20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tertiary,
    borderRadius: 50,
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  input: {
    width: deviceSize.deviceWidth * 0.70,
    height: 40,
    marginVertical: 5,
    paddingHorizontal: 10,
    color: colors.tertiary,
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
    borderRadius: 10,
    borderWidth: 2,
    fontSize: 16,
  },
  rememberUserView: {
    width: deviceSize.deviceWidth * 0.7,
    height: 40,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberUserText: {
    fontSize: 16,
    color: colors.primary,
    marginEnd: 10,
    fontWeight: 'bold',
  },
  touchableLogin: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Login',
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      userMail: '',
      userPassword: '',
      userRemember: false
    };

    this.onToggleSwitchRememberMe = this.onToggleSwitchRememberMe.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  componentWillMount() {
    const getUserInfos = async () => {
      let userMail = '';
      let userPassword = '';
      try {
        userMail = await AsyncStorage.getItem('userMail') || '';
        userPassword = await AsyncStorage.getItem('userPassword') || '';
      } catch (error) {
        // Error retrieving data
        console.log(error.message);
      }
      return { userMail: userMail, userPassword: userPassword };
    };
    getUserInfos()
      .then((userInfos) => {
        this.setState({
          userMail: userInfos.userMail,
          userPassword: userInfos.userPassword,
          userRemember: (userInfos.userMail !== '') ? true : false
        })
      })
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return false;
  }


  onToggleSwitchRememberMe = (value) => {
    this.setState({ userRemember: value });
  };

  onLogin() {
    const { userMail, userPassword, userRemember } = this.state;

    if (this.props.connectivity) {
      if (userMail !== '' && userPassword !== '') {
        this.props.loginUser(userMail, userPassword, userRemember)
          .then(() => {
            if (this.props.loginError === undefined) {
              this.props.navigation.navigate('Home');
            } else {
              Alert.alert("Warning", this.props.loginError);
            }
          });
      } else {
        Alert.alert('Warning', 'Please give a mail and a password.');
      }
    } else {
      Alert.alert('Warning', 'No internet connection.');
    }
  }

  render() {
    return (
      <ImageBackground source={images.loginBackgroundOP} style={styles.backgroundImage}>
        <View style={styles.container}>
          {(Platform.OS !== 'ios') && (
            <StatusBar hidden={true} />
          )}

          <View style={styles.inputView}>
            <TextInput
              value={this.state.userMail}
              onChangeText={(userMail) => this.setState({ userMail })}
              placeholder={'Mail'}
              selectionColor={colors.secondary}
              keyboardType='email-address'
              style={styles.input}
              autoCapitalize = 'none'
            />
            <TextInput
              value={this.state.userPassword}
              onChangeText={(userPassword) => this.setState({ userPassword })}
              placeholder={'Password'}
              selectionColor={colors.secondary}
              secureTextEntry={true}
              style={styles.input}
              autoCapitalize = 'none'
            />
            <View style={styles.rememberUserView}>
              <Text style={styles.rememberUserText}>Remember me ?</Text>
              <Switch
                onValueChange={this.onToggleSwitchRememberMe}
                value={this.state.userRemember}
                trackColor={{true: colors.primary}}
                thumbColor={"black"}
              />
            </View>
          </View>

          <View style={styles.loginView}>
            {
              (this.props.loading) ?
                <ActivityIndicator
                  size="large"
                  color={colors.primary}
                  style={{ height: 40 }}
                />
                :
                <TouchableOpacity
                  style={styles.touchableLogin}
                  onPress={() => this.onLogin()}
                >
                  <Text style={styles.loginText}>GO !</Text>
                </TouchableOpacity>
            }
          </View>

        </View>
      </ImageBackground>
    );
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
  connectivity: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired,
  loginError: PropTypes.string,
};

const mapStateToProps = state => ({
  connectivity: state.connect.connectivity,
  loading: state.connect.loading,
  loginError: state.connect.loginError,
});
const mapDispatchToProps = dispatch => ({
  loginUser: (userMail, userPassword, userRemember) => dispatch(loginUser(userMail, userPassword, userRemember)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);