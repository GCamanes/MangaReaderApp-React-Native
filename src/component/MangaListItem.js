import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { markMangaAsFavorite } from '../store/manga.action';
import { colors } from '../colors';
import { deviceSize } from '../size';
import { images } from '../images';

const styles = StyleSheet.create({
  mangaItemView: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceSize.deviceWidth * 0.15,
    width: deviceSize.deviceWidth
  },
  touchableMangaTextView: {
    justifyContent: 'center',
    height: deviceSize.deviceWidth * 0.15,
    width: deviceSize.deviceWidth * 0.85,
  },
  touchableFavoriteImgView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceSize.deviceWidth * 0.15,
    width: deviceSize.deviceWidth * 0.15,
  },
  mangaText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingStart: 10,
    color: colors.tertiary,
  },
  favoriteImg: {
    height: deviceSize.deviceWidth * 0.1,
    width: deviceSize.deviceWidth * 0.1,
  }
});

export class MangaListItem extends React.Component {
  constructor(props) {
    super(props);

    this.onPressItem = this.onPressItem.bind(this);
    this.onFavoritePress = this.onFavoritePress.bind(this);
  }

  onPressItem = () => {
    if (this.props.connectivity) {
      this.props.navigation.navigate('Chapters', {
        manga: this.props.manga.id,
      });
    } else {
      Alert.alert('Warning', 'No internet connection.');
    }
  };

  onFavoritePress = () => {
    const { id, isMangaFavorite } = this.props.manga;
    this.props.markMangaAsFavorite(id, !isMangaFavorite);
  }

  render() {
    return (
      <View style={styles.mangaItemView}>
        <TouchableOpacity
          style={styles.touchableMangaTextView}
          onPress={this.onPressItem}
        >
          <Text style={styles.mangaText}>{this.props.manga.id}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touchableFavoriteImgView}
          onPress={this.onFavoritePress}
        >
          <Image
            style={styles.favoriteImg}
            source={(this.props.manga.isMangaFavorite) ? images.favoriteOn : images.favoriteOff}
          />
        </TouchableOpacity>
      </View >
    );
  }
}

MangaListItem.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,

  connectivity: PropTypes.string.isRequired,
  manga: PropTypes.object.isRequired,
  markMangaAsFavorite: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  connectivity: state.connect.connectivity,
});
const mapDispatchToProps = dispatch => ({
  markMangaAsFavorite: (manga, value) => dispatch(markMangaAsFavorite(manga, value)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MangaListItem);