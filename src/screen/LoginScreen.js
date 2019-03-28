import React, { Component } from 'react';
import {
    Alert, Button, TextInput,
    View, StyleSheet, ActivityIndicator
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../store/connect.action';

import { secondaryColor } from '../colors';

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
    }

    onLogin() {
        const { userMail, userPassword } = this.state;
        if (this.props.connectivity) {
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
            Alert.alert('Warning', 'No internet connection');
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
                            style={styles.input}
                            onPress={this.onLogin.bind(this)}
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

LoginScreen.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }),
    connectivity: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    loginUser: PropTypes.func.isRequired,
    loginError: PropTypes.string,
    userMail: PropTypes.string.isRequired,
    userPassword: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    connectivity: state.connect.connectivity,
    loading: state.connect.loading,
    loginError: state.connect.loginError,
    userMail: state.connect.userMail,
    userPassword: state.connect.userPassword
});
const mapDispatchToProps = dispatch => ({
    loginUser: (userMail, userPassword) => dispatch(loginUser(userMail, userPassword)),
});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoginScreen);