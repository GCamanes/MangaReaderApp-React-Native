import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { primaryColor, secondaryColor, tertiaryColor } from '../colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

let deviceWidth = Dimensions.get('window').width;


export class ChapterListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isChapterRead: false
        }

        this.onPressItem = this.onPressItem.bind(this);
        this.onLongPressItem = this.onLongPressItem.bind(this);
    }

    componentWillMount() {
        const isChapterRead = async () => {
            let isChapterRead = '0';
            try {
                isChapterRead = await AsyncStorage.getItem(this.props.chapter.id) || '0';
            } catch (error) {
                // Error retrieving data
                console.log(error.message);
            }
            return isChapterRead;
        }
        isChapterRead()
            .then((isChapterRead) => {
                this.setState({
                    isChapterRead: isChapterRead
                })
            })
    }

    getChapterNumber(chapterName) {
        const start = chapterName.length - 4;
        const end = chapterName.length;
        return chapterName.substring(start, end);
    }

    onPressItem = () => {
        if (this.props.connectivity) {
            this.props.navigation.navigate('Reading', {
                manga: this.props.manga,
                chapter: this.props.chapter.id,
                chapterNumber: this.props.chapter.number
            });
        } else {
            Alert.alert('Warning', 'No internet connection.');
        }
    }

    onLongPressItem() {
        let isRead = '0';
        const markAsRead = async (chapter) => {
            try {
                if (this.state.isChapterRead === '0') {
                    await AsyncStorage.setItem(chapter.id, '1');
                    isRead = '1';
                } else {
                    await AsyncStorage.removeItem(chapter.id);
                }
            } catch (error) {
                // Error retrieving data
                console.log(error.message);
            }
        };
        markAsRead(this.props.chapter)
        .then(() => {
            this.setState({
                isChapterRead: isRead
            });
        });
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onPressItem} onLongPress={this.onLongPressItem}>
                <View style={{
                    ...styles.chapterItemView,
                    backgroundColor: (this.state.isChapterRead === '1') ? secondaryColor : primaryColor
                }}>
                    <Text 
                        style={{
                            ...styles.chapterItemText,
                            color: (this.state.isChapterRead === '1') ? primaryColor : tertiaryColor
                        }}
                    >
                        {this.getChapterNumber(this.props.chapter.id)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    chapterItemView: {
        backgroundColor: secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceWidth * 0.24,
        height: deviceWidth * 0.15,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: tertiaryColor,
        margin: 1
    },
    chapterItemText: {
        fontSize: 18,
    }
});

ChapterListItem.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,

    connectivity: PropTypes.string.isRequired,

    manga: PropTypes.string.isRequired,
    chapter: PropTypes.shape({
        id: PropTypes.string.isRequired,
        number: PropTypes.number.isRequired
    })
};
const mapStateToProps = state => ({
    connectivity: state.connect.connectivity,
});
const mapDispatchToProps = dispatch => ({

});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ChapterListItem);