import React from 'react';
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity,
    ActivityIndicator, Image
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native'

import firebase from 'react-native-firebase';

import { ChapterListItem } from '../component/ChapterListItem';

import { primaryColor, secondaryColor } from '../colors';
import { filterListDownImg, filterListUpImg } from "../images";

let deviceWidth = Dimensions.get('window').width;

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
            filter: 'down'
        };

        this.onPressFilter = this.onPressFilter.bind(this);
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
                return data._docs.map((item, index) => {
                    return ({id: item.id, number: index+1})
                })
            })
            .then((data) => {
                this.setState({
                    chapters: data.sort((a,b) => b.number - a.number),
                    loading: false
                })
            });
    }

    getChapterNumber(chapterName) {
        const start = chapterName.length - 4;
        const end = chapterName.length;
        return chapterName.substring(start, end);
    }

    onPressItem = (item) => {
        this.props.navigation.navigate('Reading', {
            manga: this.state.manga,
            chapter: item.id,
            chapterNumber: item.number
        });
    }

    onPressFilter() {
        this.setState({
            filter: (this.state.filter === 'down') ? 'up' : 'down',
            chapters: (this.state.filter === 'down') ?
                this.state.chapters.sort((a,b) => a.number - b.number) 
                : this.state.chapters.sort((a,b) => b.number - a.number) 
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.loadingView}>
                    <ActivityIndicator size="large" color={secondaryColor} />
                </View>
            );
        }
        return (
            <View style={styles.chapterListView}>
                <View style={styles.chapterListTitleView}>
                    <Text style={styles.chapterListTitle}>{this.state.manga}</Text>
                    <TouchableOpacity onPress={() => this.onPressFilter()}>
                        <Image
                            style={styles.chapterListTitleImage}
                            source={(this.state.filter === 'down') ? filterListDownImg : filterListUpImg}
                        />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={this.state.chapters}
                    extraData={this.state}
                    keyExtractor={item => item.id}
                    numColumns={4}
                    initialNumToRender={30}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => this.onPressItem(item)}>
                                <ChapterListItem chapterNumber={this.getChapterNumber(item.id)} />
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
    chapterListView: {
        flex: 1,
        backgroundColor: primaryColor
    },
    chapterListTitleView: {
        height: deviceWidth * 0.15,
        width: deviceWidth,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    chapterListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    chapterListTitleImage: {
        width: deviceWidth * 0.1,
        height: deviceWidth * 0.1,
        marginStart: 10
    }
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