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

import { MangaListItem } from '../component/MangaListItem'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

class HomeScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Manga list',
    });

    constructor(props) {
        super(props);

        this.ref = firebase.firestore().collection('mangas');
        this.unsubscribe = null;

        this.state = {
            loading: true,
            mangas: [],
        };
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const mangas = [];
        querySnapshot.forEach((doc) => {
            const { url } = doc.data();
            console.log(doc.id);
            mangas.push({
                id: doc.id,
                doc: doc, // DocumentSnapshot
                url: url
            });
        })
        this.setState({
            mangas: mangas,
            loading: false,
        });
    }

    onPressItem = (item) => {
        this.props.navigation.navigate('Reading', {
            manga: item,
        });
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: deviceWidth,
                    backgroundColor: "#CED0CE",
                }}
            />
        );
    };

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.loadingView}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#F5FCFF' }}>
                <FlatList
                    data={this.state.mangas}
                    keyExtractor={item => item.id}
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