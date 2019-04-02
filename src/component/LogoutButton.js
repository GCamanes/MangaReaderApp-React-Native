import React, { Component } from 'react';
import {
    TouchableOpacity, Image, StyleSheet, Alert
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../store/connect.action';

import { logoutImg } from '../images';

const styles = StyleSheet.create({
    image: {
        height: 40,
        width: 40,
        marginStart: 10
    },
});
export class LogoutButton extends Component {
    constructor(props) {
        super(props);
    }

    onDisconnectPress() {
        this.props.logoutUser();
        this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <TouchableOpacity onPress={() => {
                Alert.alert(
                    'Warning',
                    'Do you want to logout ?',
                    [
                        { text: 'NO', onPress: () => false, sytle: 'cancel' },
                        { text: 'YES', onPress: () => this.onDisconnectPress() },

                    ],
                );
            }}>
                <Image style={styles.image} source={logoutImg} />
            </TouchableOpacity>
        );
    }
}

LogoutButton.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,

    logoutUser: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({
    logoutUser: () => dispatch(logoutUser()),
});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LogoutButton);