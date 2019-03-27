import React from 'react';
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity, Image,
    ActivityIndicator
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native'

import firebase from 'react-native-firebase';

import { PageListItem } from '../component/PageListItem'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

export class ReadingChapterScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Chapter ' + navigation.getParam('chapter', null).number,
        };
    };

    constructor(props) {
        super(props);

        this.ref = null;
        this.unsubscribe = null;

        this.state = {
            manga: null,
            chapter: null,
            loading: true,
            pages: [],
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        this.setState({
            manga: navigation.getParam('manga', null),
            chapter: navigation.getParam('chapter', null)
        })

        this.ref = firebase.firestore()
            .collection('mangas').doc(navigation.getParam('manga', null).id)
            .collection('chapters').doc(navigation.getParam('chapter', null).id)
            .collection('pages')
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const pages = [];
        querySnapshot.forEach((doc) => {
            const { url } = doc.data();
            pages.push({
                id: doc.id,
                url: url
            });
        })
        this.setState({
            pages: pages,
            loading: false,
        });
    }

    getChapterNumber(chapterName) {
        const start = chapterName.length - 4;
        const end = chapterName.length;
        return chapterName.substring(start, end)
    }

    getPageNumber(pageNumber) {
        const start = pageNumber.length - 4;
        const end = pageNumber.length;
        return pageNumber.substring(start, end)
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 5,
                    width: deviceWidth,
                    backgroundColor: "gray",
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
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Text>{this.state.manga.id}</Text>
                <FlatList
                    data={this.state.pages}
                    keyExtractor={item => item.id}
                    numColumns={1}
                    ItemSeparatorComponent={this.renderSeparator}
                    initialNumToRender={250}
                    renderItem={({ item, index }) => {
                        return (
                            <PageListItem url={item.url} />
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
        backgroundColor: 'gray'
    },
});

ReadingChapterScreen.propTypes = {
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
)(ReadingChapterScreen);