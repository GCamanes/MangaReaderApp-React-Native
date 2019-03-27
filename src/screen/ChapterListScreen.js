import React from 'react';
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native'

import firebase from 'react-native-firebase';

import { ChapterListItem } from '../component/ChapterListItem'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

export class ChapterListScreen extends React.Component {

    static navigationOptions = {
        title: 'Chapters list'
    }

    constructor(props) {
        super(props);


        this.state = {
            isAuthenticated: false,
            manga: null,
            loading: true,
            chapters: [],
        };
    }

    componentWillMount() {
        firebase.auth().signInAnonymously()
            .then(() => {
                this.setState({
                    isAuthenticated: true,
                });
            })
            .then(() => {
                const { navigation } = this.props;
                this.setState({
                    manga: navigation.getParam('manga', 'none')
                })
            })
    }

    componentDidMount() {
        firebase.auth().signInAnonymously()
        .then(() => {
            return firebase.firestore()
                .collection('mangas').doc(this.state.manga)
                .collection('chapters').get();
        })
        .then((data) => {
            return data._docs.map((item) => (item.id))
        })
        .then((data) => {
            this.setState({
                chapters: data,
                loading: false
            })
        });
    }

    getChapterNumber(chapterName) {
        const start = chapterName.length - 4;
        const end = chapterName.length;
        return chapterName.substring(start, end)
    }

    onPressItem = (item) => {
        this.props.navigation.navigate('Reading', {
            manga: this.state.manga,
            chapter: item,
            chapterNumber: this.getChapterNumber(item)
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
                <Text>{this.state.manga}</Text>
                <FlatList
                    data={this.state.chapters}
                    keyExtractor={item => item}
                    numColumns={4}
                    ItemSeparatorComponent={this.renderSeparator}
                    initialNumToRender={250}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => this.onPressItem(item)}>
                                <ChapterListItem chapterNumber={this.getChapterNumber(item)} />
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

ChapterListScreen.propTypes = {
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
)(ChapterListScreen);