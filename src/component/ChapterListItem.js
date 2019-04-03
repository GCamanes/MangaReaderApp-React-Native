import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { primaryColor, secondaryColor, tertiaryColor } from '../colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { markChapterAsRead } from "../store/manga.action";

let deviceWidth = Dimensions.get('window').width;


export class ChapterListItem extends React.Component {
  constructor(props) {
    super(props);

    this.onPressItem = this.onPressItem.bind(this);
    this.onLongPressItem = this.onLongPressItem.bind(this);
  }

  onPressItem = () => {
    if (this.props.connectivity) {
      this.props.navigation.navigate('Reading', {
        manga: this.props.manga,
        chapter: this.props.chapter,
      });
    } else {
      Alert.alert('Warning', 'No internet connection.');
    }
  }

  onLongPressItem() {
    if (this.props.chapter.isChapterRead) {
      this.props.markChapterAsRead(this.props.chapter.id, false);
    } else {
      this.props.markChapterAsRead(this.props.chapter.id, true);
    }
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPressItem} onLongPress={this.onLongPressItem}>
        <View style={{
          ...styles.chapterItemView,
          backgroundColor: (this.props.chapter.isChapterRead) ? secondaryColor : primaryColor
        }}>
          <Text
            style={{
              ...styles.chapterItemText,
              color: (this.props.chapter.isChapterRead) ? primaryColor : tertiaryColor
            }}
          >
            {this.props.chapter.number}
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
    number: PropTypes.string.isRequired,
    isChapterRead: PropTypes.bool.isRequired
  })
};
const mapStateToProps = state => ({
  connectivity: state.connect.connectivity,
});
const mapDispatchToProps = dispatch => ({
  markChapterAsRead: (chapter, value) => dispatch(markChapterAsRead(chapter, value)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChapterListItem);