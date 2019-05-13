import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { markMangaAsFavorite } from '../store/manga.action';
import { colors } from '../colors';
import { deviceSize } from '../size';
import { images } from '../images';

const mangaItemViewSize = {height: deviceSize.deviceWidth * 0.35};
const touchableMangaViewSize = {
  height: deviceSize.deviceWidth * 0.35,
  width: deviceSize.deviceWidth * 0.875,
  marginStart: deviceSize.deviceWidth * 0.015,
};
const mangaInfosViewSize = {
  height: deviceSize.deviceWidth * 0.33,
  width: touchableMangaViewSize.width - touchableMangaViewSize.marginStart - deviceSize.deviceWidth * 0.22,
  marginStart: touchableMangaViewSize.marginStart,
}

const styles = StyleSheet.create({
  mangaItemView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: mangaItemViewSize.height,
    width: deviceSize.deviceWidth,
    marginVertical: 2,
  },
  touchableMangaView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: touchableMangaViewSize.height,
    width: touchableMangaViewSize.width,
    marginStart: touchableMangaViewSize.marginStart,
  },
  mangaImg: {
    height: deviceSize.deviceWidth * 0.33,
    width: deviceSize.deviceWidth * 0.22,
  },
  mangaInfosView: {
    justifyContent: 'center',
    height: deviceSize.deviceWidth * 0.33,
    width: mangaInfosViewSize.width,
    marginStart: mangaInfosViewSize.marginStart,
  },
  mangaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.tertiary,
  },
  mangaAuthors: {
    fontSize: 13,
    color: 'grey',
  },
  mangaStatusView: {
    width: mangaInfosViewSize.width * 0.4,
    borderRadius: 5,
    borderColor: colors.tertiary,
    borderWidth: 1
  },
  favoriteView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceSize.deviceWidth * 0.30,
    width: deviceSize.deviceWidth * 0.11,
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
          style={styles.touchableMangaView}
          onPress={this.onPressItem}
        >
          <Image source={{uri: this.props.manga.imgUrl}} style={styles.mangaImg} />
          <View style={styles.mangaInfosView}>
            <Text style={styles.mangaTitle}>
              {this.props.manga.id}
            </Text>
            <Text style={styles.mangaAuthors}>
              {this.props.manga.authors.join(', ')}
            </Text>
            <View>
              <Text style={{color: colors.secondary, fontWeight: 'bold'}}>
                Last chapter: {this.props.manga.lastChapter}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{ color: colors.secondary, fontWeight: 'bold'}}>
                Status:
              </Text>
              <Text style={{ color: (this.props.manga.status === 'Completed') ? 'green' : colors.quaternary, fontWeight: 'bold' }}>
                {" " + this.props.manga.status}
              </Text>
            </View>
          </View>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteView}
          onPress={this.onFavoritePress}
        >
          <Image
            style={styles.favoriteImg}
            source={(this.props.manga.isMangaFavorite) ? images.favoriteOn : images.favoriteOff}
          />
        </TouchableOpacity>

        { /*<TouchableOpacity
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
        </TouchableOpacity> */}
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