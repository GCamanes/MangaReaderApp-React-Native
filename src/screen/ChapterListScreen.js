import React from 'react';
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity,
    ActivityIndicator, Image, Alert
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Dimensions} from 'react-native';

import ChapterListItem from '../component/ChapterListItem';

import {loadChapters} from '../store/manga.action';

import {primaryColor, secondaryColor} from '../colors';
import FilterButton from "../component/FilterButton";

let deviceWidth = Dimensions.get('window').width;

export class ChapterListScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('manga', 'none'),
            headerRight: <FilterButton />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            manga: null,
            filter: 'down',
            refresh: false
        };

        this.onPressFilter = this.onPressFilter.bind(this);
    }

    componentWillMount() {
        const {navigation} = this.props;
        this.setState({
            manga: navigation.getParam('manga', 'none')
        });
    }

    componentDidMount() {
        if (this.props.connectivity) {
            this.props.loadChapters(this.props.userMail, this.props.userPassword, this.state.manga)
                .then(() => {
                    if (this.props.mangasError !== undefined) {
                        Alert.alert("Warning", this.props.chaptersError);
                    }
                });
        } else {
            Alert.alert('Warning', 'No internet connection.');
        }
    }

    onPressFilter() {
        this.setState({
            filter: (this.state.filter === 'down') ? 'up' : 'down',
            refresh: !this.state.refresh,
        });
    }

    render() {
        if (this.props.chaptersLoading) {
            return (
                <View style={styles.loadingView}>
                    <ActivityIndicator size="large" color={secondaryColor}/>
                </View>
            );
        }
        if (this.props.chapters.length === 0) {
            return (
                <View style={styles.loadingView}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: secondaryColor
                    }}
                    >No available chapters in firestore.</Text>
                </View>
            );
        }
        return (
            <View style={styles.chapterListView}>
                <FlatList
                    data={this.props.chapters}
                    extraData={this.props.chaptersListNeedRefresh}
                    keyExtractor={item => item.id}
                    numColumns={4}
                    initialNumToRender={30}
                    renderItem={({item}) => {
                        return (
                            <ChapterListItem manga={this.state.manga} chapter={item}
                                             navigation={this.props.navigation}/>
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
        backgroundColor: primaryColor,
    },
    chapterFilterView: {
        height: deviceWidth * 0.15,
        width: deviceWidth,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    chapterFilterText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    chapterFilterImage: {
        width: deviceWidth * 0.1,
        height: deviceWidth * 0.1,
        marginEnd: 10
    }
});

ChapterListScreen.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,

    connectivity: PropTypes.string.isRequired,
    userMail: PropTypes.string.isRequired,
    userPassword: PropTypes.string.isRequired,

    chapters: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            number: PropTypes.number.isRequired
        })
    ),
    chaptersError: PropTypes.string,
    chaptersLoading: PropTypes.bool.isRequired,
    loadChapters: PropTypes.func.isRequired,
    chaptersListFilter: PropTypes.string.isRequired,
    chaptersListNeedRefresh: PropTypes.bool.isRequired,
};
const mapStateToProps = state => ({
    connectivity: state.connect.connectivity,
    userMail: state.connect.userMail,
    userPassword: state.connect.userPassword,

    chapters: state.manga.chapters,
    chaptersError: state.manga.chaptersError,
    chaptersLoading: state.manga.chaptersLoading,
    chaptersListFilter: state.manga.chaptersListFilter,
    chaptersListNeedRefresh: state.manga.chaptersListNeedRefresh
});
const mapDispatchToProps = dispatch => ({
    loadChapters: (userMail, userPassword, manga) => dispatch(loadChapters(userMail, userPassword, manga)),
});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ChapterListScreen);