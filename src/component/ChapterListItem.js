import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { colors } from '../colors';
import { markChapterAsRead } from "../store/manga.action";
import { deviceSize} from '../size';

const styles = StyleSheet.create({
  chapterItemView: {
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    width: deviceSize.deviceWidth * 0.31,
    height: deviceSize.deviceWidth * 0.15,
    borderWidth: 3,
    borderColor: colors.tertiary,
    padding: 2,
    marginStart:2,
    marginEnd:2,
  },
  chapterItemText: {
    fontSize: 18,
  }
});

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
    const { id, isChapterRead } = this.props.chapter;
    this.props.markChapterAsRead(id, !isChapterRead);
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPressItem} onLongPress={this.onLongPressItem} delayLongPress={500}>
        <View style={{
          ...styles.chapterItemView,
          backgroundColor: (this.props.chapter.isChapterRead) ? colors.quaternary : colors.primary,
          marginTop: (this.props.isTop) ? 10 : 2,
          marginBottom: (this.props.isBottom) ? 10 : 2,
        }}>
          <Text
            style={{
              ...styles.chapterItemText,
              color: (this.props.chapter.isChapterRead) ? colors.primary : colors.tertiary
            }}
          >
            {this.props.chapter.number}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

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