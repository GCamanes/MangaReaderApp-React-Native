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

import PageView from '../component/PageView'
import { leftArrowImg, rightArrowImg, rightArrowBoldImg, leftArrowBoldImg } from '../images'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

export class ReadingChapterScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Chapter ' + navigation.getParam('chapterNumber', 'none'),
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            manga: null,
            chapter: null,
            loading: true,
            pages: [],
            currentPageIndex: 0,
        };

        this.getCurrentPageUrl = this.getCurrentPageUrl.bind(this);
        this.goToNextPage = this.goToNextPage.bind(this)
        this.goToPreviousPage = this.goToPreviousPage.bind(this)
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
                    manga: navigation.getParam('manga', 'none'),
                    chapter: navigation.getParam('chapter', 'none'),
                })
            })
    }

    componentDidMount() {
        firebase.auth().signInAnonymously()
            .then(() => {
                return firebase.firestore()
                    .collection('mangas').doc(this.state.manga)
                    .collection('chapters').doc(this.state.chapter)
                    .collection('pages').get();
            })
            .then((data) => {
                return data._docs.map((item, index) => {
                    
                    return (
                        { id: item.id, page: index, url: item._data.url }
                    )
                })
            })
            .then((data) => {
                console.log(data)
                this.setState({
                    pages: data,
                    loading: false
                })
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

    getCurrentPageUrl() {
        return this.state.pages[this.state.currentPageIndex].url
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

    onPressNextPage() {
        if(this.state.currentPageIndex != (this.state.pages.length-1)) {
            this.setState({
                currentPageIndex: this.state.currentPageIndex+1
            })
        }
    }

    onPressPreviousPage() {
        if(this.state.currentPageIndex != 0) {
            this.setState({
                currentPageIndex: this.state.currentPageIndex-1
            })
        }
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
            <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column' }}>
                <PageView url={this.getCurrentPageUrl()}/>

                <View style={{ flex: 1, backgroundColor: 'green', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.onPressPreviousPage()}>
                        <Image
                            style={{
                                width: deviceWidth * 0.10,
                                height: (deviceWidth * 0.10),
                            }}
                            source={leftArrowImg}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressNextPage()}>
                        <Image
                            style={{
                                width: deviceWidth * 0.10,
                                height: (deviceWidth * 0.10),
                            }}
                            source={rightArrowBoldImg}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </View>
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