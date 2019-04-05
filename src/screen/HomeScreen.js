import React, { Component } from 'react';
import {
  View, StyleSheet,
  TouchableOpacity, FlatList,
  ActivityIndicator, Alert,
  BackHandler, StatusBar, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MangaListItem } from '../component/MangaListItem';
import LogoutButton from '../component/LogoutButton';
import { SearchBar } from '../component/SearchBar';
import { primaryColor, secondaryColor, tertiaryColor } from '../colors';
import { logoutUser } from '../store/connect.action';
import { loadMangas } from '../store/manga.action';
import { deviceSize} from '../size';

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Manga list',
    headerLeft: <LogoutButton navigation={navigation}/>,
    headerStyle: { backgroundColor: secondaryColor },
  });

  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };

    this.onCancelSearch = this.onCancelSearch.bind(this);
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
    return true;
  }

  onSearchChange = search => {
    this.setState({ search });
  };

  onCancelSearch() {
    this.setState({ search: '' });
  }

  onPressItem = (item) => {
    if (this.props.connectivity) {
      this.props.navigation.navigate('Chapters', {
        manga: item,
      });
    } else {
      Alert.alert('Warning', 'No internet connection.');
    }
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: deviceSize.deviceWidth,
          backgroundColor: secondaryColor,
        }}
      />
    );
  };

  render() {
    if (this.props.mangasLoading) {
      return (
        <View style={styles.loadingView}>
          {(Platform.OS !== 'ios') && (
            <StatusBar hidden={true} />
          )}
          <ActivityIndicator size="large" color={secondaryColor}/>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: primaryColor }}>
        {(Platform.OS !== 'ios') && (
          <StatusBar hidden={true} />
        )}
        <View style={{ height: 1, width: deviceSize.deviceWidth, backgroundColor: tertiaryColor }}/>
        <SearchBar
          onSearchChange={this.onSearchChange}
          onCancelSearch={this.onCancelSearch}
          value={this.state.search}
        />
        <View style={{ height: 1, width: deviceSize.deviceWidth, backgroundColor: tertiaryColor }}/>
        <FlatList
          data={this.props.mangas.filter((item) => item.includes(this.state.search))}
          keyExtractor={item => item}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => this.onPressItem(item)}>
                <MangaListItem manga={item}/>
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
    backgroundColor: primaryColor
  },
});

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,

  connectivity: PropTypes.string.isRequired,
  userMail: PropTypes.string.isRequired,
  userPassword: PropTypes.string.isRequired,

  mangas: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ),
  mangasError: PropTypes.string,
  mangasLoading: PropTypes.bool.isRequired,
  loadMangas: PropTypes.func.isRequired,

  logoutUser: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  connectivity: state.connect.connectivity,
  userMail: state.connect.userMail,
  userPassword: state.connect.userPassword,

  mangas: state.manga.mangas,
  mangasError: state.manga.mangasError,
  mangasLoading: state.manga.mangasLoading,
});
const mapDispatchToProps = dispatch => ({
  loadMangas: (userMail, userPassword) => dispatch(loadMangas(userMail, userPassword)),
  logoutUser: () => dispatch(logoutUser()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen);