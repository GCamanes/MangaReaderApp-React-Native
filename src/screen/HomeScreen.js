import React, { Component } from 'react';
import { NetInfo } from 'react-native';
import {
    View, Text,
    Dimensions,
    TouchableOpacity, FlatList
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import firebase from 'react-native-firebase';

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

class HomeScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Manga Reader',
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

    render() {
        if (this.state.loading) {
            return null; // or render a loading icon
        }
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.state.mangas}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => this.onPressItem(item)}>
                                <Text>{ item.id }</Text>
                            </TouchableOpacity>
                        )
                    }}
            />
            </View>
        );
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