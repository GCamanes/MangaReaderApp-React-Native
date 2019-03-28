import React, { Component } from 'react';
import {
    View, StyleSheet,
    Dimensions,
    TouchableOpacity, FlatList,
    ActivityIndicator, Alert,
    BackHandler
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import firebase from 'react-native-firebase';

import { MangaListItem } from '../component/MangaListItem';
import LogoutButton from '../component/LogoutButton'
import { primaryColor, secondaryColor } from '../colors';

let deviceWidth = Dimensions.get('window').width;

class HomeScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Manga list',
        headerLeft: <LogoutButton navigation={navigation} />,
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            mangas: []
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        firebase.auth().signInWithEmailAndPassword(this.props.userMail, this.props.userPassword)
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
            })
            .catch((error) => (console.log(error)));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }

    onPressItem = (item) => {
        if (this.props.connectivity) {
            this.props.navigation.navigate('Chapters', {
                manga: item,
            });
        } else {
            Alert.alert('Warning', 'No internet connection.');
        }
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
    userMail: PropTypes.string.isRequired,
    userPassword: PropTypes.string.isRequired
};
const mapStateToProps = state => ({
    connectivity: state.connect.connectivity,
    userMail: state.connect.userMail,
    userPassword: state.connect.userPassword
});
const mapDispatchToProps = dispatch => ({

});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HomeScreen);