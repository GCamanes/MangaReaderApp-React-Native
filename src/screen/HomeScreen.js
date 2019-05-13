import React, { Component } from 'react';
import {
  View, StyleSheet,
  SectionList,
  ActivityIndicator, Alert,
  BackHandler, StatusBar,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MangaListItem from '../component/MangaListItem';
import LogoutButton from '../component/LogoutButton';
import { SearchBar } from '../component/SearchBar';
import { MangaListSectionTitleView } from '../component/MangaListSectionTitleView';
import { colors } from '../colors';
import { logoutUser } from '../store/connect.action';
import { loadMangas } from '../store/manga.action';
import { deviceSize} from '../size';

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
});

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Manga list',
    headerTitleStyle: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: 'bold',
    },
    headerLeft: <LogoutButton navigation={navigation}/>,
    headerStyle: { backgroundColor: colors.secondary },
  });

  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };

    this.onCancelSearch = this.onCancelSearch.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    if (this.props.connectivity) {
      this.props.loadMangas(this.props.userMail, this.props.userPassword)
        .then(() => {
          if (this.props.mangasError !== undefined) {
            Alert.alert("Warning", this.props.mangasError);
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
    Alert.alert(
      'Warning',
      'Do you want to logout ?',
      [
        { text: 'NO', sytle: 'cancel' },
        { text: 'YES', onPress: () => this.onDisconnectPress() },

      ],
    );
    return true;
  }

  onSearchChange = search => {
    this.setState({ search });
  };

  onCancelSearch() {
    this.setState({ search: '' });
  }

  onDisconnectPress() {
    this.props.logoutUser();
    this.props.navigation.goBack();
  }

  renderSeparator = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            height: 1,
            width: deviceSize.deviceWidth * 0.7,
            backgroundColor: colors.quaternary,
            borderRadius: 200,
            borderWidth: 1,
            borderColor: colors.quaternary,
          }}
        />
      </View>
    );
  };

  render() {
    if (this.props.mangasLoading) {
      return (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={colors.secondary}/>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary }}>
        <SearchBar
          onSearchChange={this.onSearchChange}
          onCancelSearch={this.onCancelSearch}
          value={this.state.search}
        />
        <View style={{ height: 2, width: deviceSize.deviceWidth, backgroundColor: colors.tertiary }}/>
        <SectionList
          extraData={this.props.mangasListNeedRefresh}
          //ItemSeparatorComponent={this.renderSeparator}
          renderSectionHeader={({section: {title}}) => (
            <MangaListSectionTitleView title={title}/>
          )}
          sections={[
            {title: 'Favorites', data: this.props.mangas.filter((item) => (
              item.id.toLowerCase().includes(this.state.search) && (item.isMangaFavorite)
              ))},
            {title: 'Others', data: this.props.mangas.filter((item) => (
              item.id.toLowerCase().includes(this.state.search) && (!item.isMangaFavorite)
              ))},
          ]}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <MangaListItem manga={item} navigation={this.props.navigation}/>
            )
          }}
        />
      </View>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,

  connectivity: PropTypes.string.isRequired,
  userMail: PropTypes.string.isRequired,
  userPassword: PropTypes.string.isRequired,

  mangas: PropTypes.arrayOf(
    PropTypes.object.isRequired
  ),
  mangasError: PropTypes.string,
  mangasLoading: PropTypes.bool.isRequired,
  loadMangas: PropTypes.func.isRequired,
  mangasListNeedRefresh: PropTypes.bool.isRequired,

  logoutUser: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  connectivity: state.connect.connectivity,
  userMail: state.connect.userMail,
  userPassword: state.connect.userPassword,

  mangas: state.manga.mangas,
  mangasError: state.manga.mangasError,
  mangasLoading: state.manga.mangasLoading,
  mangasListNeedRefresh: state.manga.mangasListNeedRefresh
});
const mapDispatchToProps = dispatch => ({
  loadMangas: (userMail, userPassword) => dispatch(loadMangas(userMail, userPassword)),
  logoutUser: () => dispatch(logoutUser()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen);