import React, { Component } from 'react';
import { NetInfo } from 'react-native';
import {
    View, Text, StyleSheet,
    Dimensions,
    TouchableOpacity, FlatList,
    ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import firebase from 'react-native-firebase';

import { MangaListItem } from '../component/MangaListItem';
import { primaryColor, secondaryColor } from '../colors';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

class HomeScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Manga list',
    });

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            loading: true,
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
                mangas: data,
                loading: false
            })
        });
    }

    onPressItem = (item) => {
        this.props.navigation.navigate('Chapters', {
            manga: item,
        });
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: deviceWidth,
                    backgroundColor: secondaryColor,
                }}
            />
        );
    };

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.loadingView}>
                    <ActivityIndicator size="large" color={secondaryColor} />
                </View>
            );
        }
        return (
            <View style={{ flex: 1, backgroundColor: primaryColor }}>
                <FlatList
                    data={this.state.mangas}
                    keyExtractor={item => item}
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => this.onPressItem(item)}>
                                <MangaListItem manga={item}/>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    scrollview: {
        width: deviceWidth,
    },
});

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