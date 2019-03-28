import React from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, Image,
    ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';

import firebase from 'react-native-firebase';

import { loadImageRatio } from '../store/image.action';
import { primaryColor, secondaryColor } from '../colors';

import PageView from '../component/PageView';
import { leftArrowImg, rightArrowImg } from '../images';

let deviceWidth = Dimensions.get('window').width;

export class ReadingChapterScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Chapter ' + navigation.getParam('chapterNumber', 'none'),
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            manga: null,
            chapter: null,
            loading: true,
            pages: [],
            currentPageIndex: 0,
        };

        this.getCurrentPageUrl = this.getCurrentPageUrl.bind(this);
        this.onPressNextPage = this.onPressNextPage.bind(this)
        this.onPressPreviousPage = this.onPressPreviousPage.bind(this)
    }

    componentWillMount() {
        const { navigation } = this.props;
        this.setState({
            manga: navigation.getParam('manga', 'none'),
            chapter: navigation.getParam('chapter', 'none'),
        })
    }

    componentDidMount() {
        firebase.auth().signInWithEmailAndPassword(this.props.userMail, this.props.userPassword)
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
            })
            .then(() => this.props.loadImageRatio(this.state.pages[0].url))
            .catch((error) => (console.log(error)));
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

    onPressNextPage() {
        if(this.state.currentPageIndex != (this.state.pages.length-1)) {
            this.setState({
                currentPageIndex: this.state.currentPageIndex+1
            })
            this.props.loadImageRatio(this.state.pages[this.state.currentPageIndex+1].url)
        }
    }

    onPressPreviousPage() {
        if(this.state.currentPageIndex != 0) {
            this.setState({
                currentPageIndex: this.state.currentPageIndex-1
            })
            this.props.loadImageRatio(this.state.pages[this.state.currentPageIndex-1].url)
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.loadingView}>
                    <ActivityIndicator size="large" color={secondaryColor} />
                </View>
            );
        } else {
            return (
                <View style={styles.readingChapterView}>
                    <View style={{flex: 10}}>
                        <PageView/>
                    </View>
                    
                    <View style={styles.bottomNavView}>
                        <View style={styles.bottomNavPartView}>
                            {
                                (this.state.currentPageIndex !== 0) &&
                                    <TouchableOpacity
                                        style={styles.bottomNavTouchableView}
                                        onPress={() => this.onPressPreviousPage()} >
                                        <Image
                                            style={styles.bottomNavTouchableImg}
                                            source={leftArrowImg}
                                            resizeMode="cover"
                                        />
                                        <Text style={styles.bottomNavTouchableText}>Prev</Text>
                                    </TouchableOpacity>
                            }
                        </View>

                        <View style={styles.bottomNavPartView}>
                            <Text style={styles.bottomNavTouchableText}>
                                {this.state.currentPageIndex+1}/{this.state.pages.length}
                            </Text>
                        </View>

                        <View style={styles.bottomNavPartView}>
                            {
                                (this.state.currentPageIndex !== (this.state.pages.length-1)) &&
                                    <TouchableOpacity
                                        style={styles.bottomNavTouchableView}
                                        onPress={() => this.onPressNextPage()} >
                                        <Text style={styles.bottomNavTouchableText}>Next</Text>
                                        <Image
                                            style={styles.bottomNavTouchableImg}
                                            source={rightArrowImg}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primaryColor
    },
    readingChapterView: {
        flex: 1,
        backgroundColor: primaryColor,
        flexDirection: 'column'
    },
    bottomNavView: {
        flex: 1,
        backgroundColor: secondaryColor,
        flexDirection: 'row'
    },
    bottomNavPartView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomNavTouchableView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',justifyContent: 'center'
    },
    bottomNavTouchableImg: {
        width: deviceWidth * 0.10,
        height: deviceWidth * 0.10,
    },
    bottomNavTouchableText: {
        color: 'black',
        fontSize: 18,
    }
});

ReadingChapterScreen.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,

    connectivity: PropTypes.string.isRequired,
    userMail: PropTypes.string.isRequired,
    userPassword: PropTypes.string.isRequired,
    loadImageRatio: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
    connectivity: state.connect.connectivity,
    userMail: state.connect.userMail,
    userPassword: state.connect.userPassword
});
const mapDispatchToProps = dispatch => ({
    loadImageRatio: (url) => dispatch(loadImageRatio(url)),
});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ReadingChapterScreen);