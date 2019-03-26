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

        this.ref = null;
        this.unsubscribe = null;

        this.state = {
            manga: null,
            loading: true,
            chapters: [],
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        this.setState({
            manga: navigation.getParam('manga', null)
        })
        this.ref = firebase.firestore().collection('mangas').doc(navigation.getParam('manga', null).id).collection('chapters');
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const chapters = [];
        querySnapshot.forEach((doc) => {
            const { url } = doc.data();
            chapters.push({
                id: doc.id,
                doc: doc, // DocumentSnapshot
                url: url
            });
        })
        this.setState({
            chapters: chapters,
            loading: false,
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

    getChapterNumber(chapterName) {
        const start = chapterName.length - 4;
        const end = chapterName.length;
        return chapterName.substring(start, end)
    }

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
                <Text>{this.state.manga.id}</Text>
                <FlatList
                    data={this.state.chapters}
                    keyExtractor={item => item.id}
                    numColumns={4}
                    ItemSeparatorComponent={this.renderSeparator}
                    initialNumToRender={250}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity >
                                <ChapterListItem chapterNumber={this.getChapterNumber(item.id)}/>
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