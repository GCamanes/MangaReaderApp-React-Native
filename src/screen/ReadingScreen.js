import React from 'react';
import {
    StyleSheet, Text, View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

export class ReadingScreen extends React.Component {

    static navigationOptions = {
        title: 'Reading screen'
    }

    constructor(props) {
        super(props);

        this.state = {
            manga: null
        }
    }

    componentWillMount() {
        const { navigation } = this.props;
        this.setState({
            manga: navigation.getParam('manga', null)
        })
    }

    render() {

        return (
            <View style={styles.mainView}>

                <ScrollView style={styles.scrollview} ref={(c) => {this.scroll = c}}>
                    <Text>{this.state.manga.id}</Text>
                    <Text>{this.state.manga.url}</Text>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    mainView: {

    },
    scrollview: {
        width: deviceWidth,
    },
});

ReadingScreen.propTypes = {
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
)(ReadingScreen);