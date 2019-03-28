import React, { Component } from 'react';
import {
    Alert, Button, TextInput, Dimensions,
    View, StyleSheet, ActivityIndicator
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../store/connect.action';

import { primaryColor, secondaryColor } from '../colors';

let deviceWidth = Dimensions.get('window').width;

export class LoginScreen extends Component {
    static navigationOptions = {
        title: 'Login'
    }

    constructor(props) {
        super(props);

        this.state = {
            userMail: '',
            userPassword: '',
        };

        this.onLogin = this.onLogin.bind(this);
    }

    onLogin() {
        const { userMail, userPassword } = this.state;
        
        if (this.props.connectivity) {
            if (userMail !== '' && userPassword !== '') {
                this.props.loginUser(userMail, userPassword)
                    .then(() => {
                        this.setState({
                            userMail: '',
                            userPassword: '',
                        })
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
            <View style={styles.container}>
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
                {
                    (this.props.loading) ?
                        <ActivityIndicator size="large" color={secondaryColor} />
                    :
                        <Button
                            title={'Login'}
                            style={styles.button}
                            onPress={() => this.onLogin()}
                        />
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
    input: {
        width: deviceWidth * 0.7,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: secondaryColor,
        marginBottom: 10,
    },
    button: {
        width: 200,
        backgroundColor: secondaryColor
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
    loginUser: (userMail, userPassword) => dispatch(loginUser(userMail, userPassword)),
});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoginScreen);