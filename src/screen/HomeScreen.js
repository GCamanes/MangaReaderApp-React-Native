import React, { Component } from 'react';
import { NetInfo } from 'react-native';
import {
    View, Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

class HomeScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Home screen',
    });

    constructor(props) {
        super(props);
    }

    onPressItem = (item) => {
        this.props.navigation.navigate('Reading', {
            mangaName: item,
        });
    }

    render() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>{this.props.connectivity}</Text>
                <TouchableOpacity onPress={() => this.onPressItem("naruto")}>
                    <Text>Naruto</Text>
                </TouchableOpacity>
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