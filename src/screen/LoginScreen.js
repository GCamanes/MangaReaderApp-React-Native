import React, { Component } from 'react';
import {
    Alert, TouchableOpacity, TextInput, Dimensions,
    View, StyleSheet, ActivityIndicator, Text, Switch
} from 'react-native';
import { AsyncStorage } from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../store/connect.action';

import { primaryColor, secondaryColor, tertiaryColor } from '../colors';

let deviceWidth = Dimensions.get('window').width;

export class LoginScreen extends Component {
    static navigationOptions = {
        title: 'Login',
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            userMail: '',
            userPassword: '',
            userRemember: false
        };

        this.onToggleSwitchRememberMe = this.onToggleSwitchRememberMe.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    componentWillMount() {
        const getUserInfos = async () => {
            let userId = '';
            try {
                userMail = await AsyncStorage.getItem('userMail') || '';
                userPassword = await AsyncStorage.getItem('userPassword') || '';
            } catch (error) {
                // Error retrieving data
                console.log(error.message);
            }
            return {userMail: userMail, userPassword: userPassword};
        }
        getUserInfos()
            .then((userInfos) => {
                this.setState({
                    userMail: userInfos.userMail,
                    userPassword: userInfos.userPassword,
                    userRemember: (userInfos.userMail !== '') ? true : false
                })
            })
    }

    onToggleSwitchRememberMe = (value) => {
        this.setState({ userRemember: value })
    }

    onLogin() {
        const { userMail, userPassword, userRemember } = this.state;

        if (this.props.connectivity) {
            if (userMail !== '' && userPassword !== '') {
                this.props.loginUser(userMail, userPassword, userRemember)
                    .then(() => {
                        if (this.props.loginError === undefined) {
                            this.setState({
                                userMail: '',
                                userPassword: '',
                            })
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
            <View style={styles.container}>
                <Text style={styles.welcomeText}>Welcome to</Text>
                <Text style={{ ...styles.welcomeText, marginBottom: 20 }}>Manga Reader App !</Text>
                <TextInput
                    value={this.state.userMail}
                    onChangeText={(userMail) => this.setState({ userMail })}
                    placeholder={'Mail'}
                    keyboardType='email-address'
                    style={styles.input}
                />
                <TextInput
                    value={this.state.userPassword}
                    onChangeText={(userPassword) => this.setState({ userPassword })}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    style={styles.input}
                />
                <View style={styles.rememberUserView}>
                    <Text style={styles.rememberUserText}>Remember me ?</Text>
                    <Switch
                        onValueChange={this.onToggleSwitchRememberMe}
                        value={this.state.userRemember}
                    />
                </View>
                {
                    (this.props.loading) ?
                        <ActivityIndicator
                            size="large"
                            color={secondaryColor}
                            style={{ marginTop: 15 }}
                        />
                        :
                        <TouchableOpacity
                            style={styles.touchableLogin}
                            onPress={() => this.onLogin()}
                        >
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: primaryColor,
    },
    welcomeText: {
        color: secondaryColor,
        fontSize: 25,
        fontWeight: 'bold',
    },
    input: {
        width: deviceWidth * 0.7,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: secondaryColor,
        marginBottom: 10,
    },
    rememberUserView: {
        width: deviceWidth * 0.7,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rememberUserText: {
        fontSize: 14,
        color: tertiaryColor,
        marginEnd: 10
    },
    touchableLogin: {
        width: deviceWidth * 0.7,
        height: 40,
        borderRadius: 20,
        marginTop: 15,
        backgroundColor: secondaryColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginText: {
        color: primaryColor,
        fontSize: 20,
        fontWeight: 'bold'
    }

});

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