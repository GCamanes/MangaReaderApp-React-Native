import React from 'react';
import {
  StyleSheet, Text, View, FlatList,
  ActivityIndicator, Alert, BackHandler
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ChapterListItem from '../component/ChapterListItem';
import { loadChapters } from '../store/manga.action';
import { colors } from '../colors';
import FilterButton from '../component/FilterButton';
import { NavBackButton } from '../component/NavBackButton';
import { deviceSize} from '../size';

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  chapterListView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  chapterFilterView: {
    height: deviceSize.deviceWidth * 0.15,
    width: deviceSize.deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
});

export class ChapterListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('manga', 'none'),
      headerTitleStyle: {
        color: colors.primary,
        fontSize: 22,
        fontWeight: 'bold',
      },
      headerLeft: <NavBackButton navigation={navigation}/>,
      headerRight: <FilterButton manga={navigation.getParam('manga', 'none')}/>,
      headerStyle: { backgroundColor: colors.secondary },
    };
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      manga: navigation.getParam('manga', 'none'),
    };

    this.handleBackButton = this.handleBackButton.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    if (this.props.connectivity) {
      this.props.loadChapters(this.props.userMail, this.props.userPassword, this.state.manga)
        .then(() => {
          if (this.props.mangasError !== undefined) {
            Alert.alert('Warning', this.props.chaptersError);
          }
        });
    } else {
      Alert.alert('Warning', 'No internet connection.');
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  isChapterAtTop(index, numColumns) {
    return (index < numColumns);
  }

  isChapterAtBottom(index, numColumns, dataLength) {
    const diffColumns = dataLength % numColumns;
    return (index >= (dataLength - ((diffColumns !== 0)?diffColumns:numColumns)));
  }

  render() {
    if (this.props.chaptersLoading) {
      return (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={colors.secondary}/>
        </View>
      );
    }
    if (this.props.chapters && this.props.chapters.length === 0) {
      return (
        <View style={styles.loadingView}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.secondary
          }}
          >No available chapters in firestore.</Text>
        </View>
      );
    }
    return (
      <View style={styles.chapterListView}>
        <FlatList
          contentContainerStyle={{width: deviceSize.deviceWidth, alignItems: 'center'}}
          data={this.props.chapters}
          extraData={this.props.chaptersListNeedRefresh}
          keyExtractor={item => item.id}
          numColumns={3}
          initialNumToRender={30}
          onEndReachedThreshold={30}
          renderItem={({ item, index }) => {
            return (
              <ChapterListItem 
                manga={this.state.manga} chapter={item}
                isTop={this.isChapterAtTop(index, 3)}
                isBottom={this.isChapterAtBottom(index, 3, this.props.chapters.length)}
                navigation={this.props.navigation}
              />
            )
          }}
        />
      </View>
    );
  }
}

ChapterListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,

  connectivity: PropTypes.string.isRequired,
  userMail: PropTypes.string.isRequired,
  userPassword: PropTypes.string.isRequired,

  chapters: PropTypes.array,
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