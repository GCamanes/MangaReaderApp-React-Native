import React, { Component } from 'react';
import { NetInfo } from 'react-native';
import {
    View, Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import firebase from 'react-native-firebase';

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

class HomeScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Home screen',
    });

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            mangas: []
        };
    }

    componentWillMount() {
        firebase.auth().signInAnonymously()
        .then(() => {
            this.setState({
                isAuthenticated: true,
            });
        });
    }

    componentDidMount() {
        firebase.auth().signInAnonymously()
        .then(() => {
            return firebase.firestore().collection('mangas').get()
        })
        .then((data) => {
            return data._docs.map((item) => (item.id))
        })
        .then((data) => {
            this.setState({
                mangas: data
            })
        });
    }

    onPressItem = (item) => {
        this.props.navigation.navigate('Reading', {
            mangaName: item,
        });
    }

    render() {
        if (!this.state.isAuthenticated) {
            return null;
        }
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>{this.props.connectivity}</Text>
                <TouchableOpacity onPress={() => this.onPressItem("naruto")}>
                    <Text>Naruto</Text>
                </TouchableOpacity>
                {
                    (this.state.isAuthenticated) ?
                        <Text>Authenticated</Text>
                    :
                        <Text>Not authenticated</Text>
                }
                {
                    this.state.mangas.map((item) => {
                        return (
                            <Text>{item}</Text>
                        )
                    })
                }
            </View>
        )
    }
}

HomeScreen.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,

    connectivity: PropTypes.string.isRequired,
};
const mapStateToProps = state => ({
    connectivity: state.connect.connectivity,
});
const mapDispatchToProps = dispatch => ({

});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HomeScreen);