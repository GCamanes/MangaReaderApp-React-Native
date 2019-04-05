import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
  ActivityIndicator, Alert, BackHandler,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header } from 'react-navigation';
import { loadPages, markChapterAsRead } from '../store/manga.action'
import { loadImageRatio } from '../store/image.action';
import { primaryColor, secondaryColor, tertiaryColor } from '../colors';
import PageView from '../component/PageView';
import { leftArrowImg, rightArrowImg, asReadImg } from '../images';
import { deviceSize } from '../size';

let headerHeight = Header.HEIGHT;

let availableHeight = deviceSize.deviceHeight - headerHeight;
let pageViewHeight = availableHeight * 0.9;
let bottomNavViewHeight = availableHeight * 0.1;

export class ReadingChapterScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Chapter ' + navigation.getParam('chapter', 'none').number,
      headerStyle: { backgroundColor: secondaryColor },
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      manga: null,
      chapter: null,
      currentPageIndex: 0,
    };

    this.getCurrentPageUrl = this.getCurrentPageUrl.bind(this);
    this.onPressNextPage = this.onPressNextPage.bind(this);
    this.onPressPreviousPage = this.onPressPreviousPage.bind(this);
    this.onPressMarkAsRead = this.onPressMarkAsRead.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  componentWillMount() {
    const { navigation } = this.props;
    this.setState({
      manga: navigation.getParam('manga', 'none'),
      chapter: navigation.getParam('chapter', 'none'),
    });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    if (this.props.connectivity) {
      this.props.loadPages(
        this.props.userMail, this.props.userPassword,
        this.state.manga, this.state.chapter.id
      )
        .then(() => this.props.loadImageRatio(this.props.pages[0].url))
        .catch((error) => (console.log(error)));
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

  getCurrentPageUrl() {
    return this.state.pages[this.state.currentPageIndex].url;
  }

  onPressNextPage() {
    if (this.state.currentPageIndex != (this.props.pages.length - 1)) {
      this.setState({
        currentPageIndex: this.state.currentPageIndex + 1
      });
      this.props.loadImageRatio(this.props.pages[this.state.currentPageIndex + 1].url);
    }
  }

  onPressPreviousPage() {
    if (this.state.currentPageIndex != 0) {
      this.setState({
        currentPageIndex: this.state.currentPageIndex - 1
      });
      this.props.loadImageRatio(this.props.pages[this.state.currentPageIndex - 1].url);
    }
  }

  onPressMarkAsRead() {
    this.props.markChapterAsRead(this.state.chapter.id, true)
      .then(() => this.props.navigation.navigate('Chapters'));
  }

  render() {
    if (this.props.pagesLoading) {
      return (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={secondaryColor}/>
        </View>
      );
    } else {
      return (
        <View style={styles.readingChapterView}>
          <View style={{ height: pageViewHeight, width: deviceSize.deviceWidth, }}>
            <PageView pageViewHeight={pageViewHeight}/>
          </View>

          <View style={styles.bottomNavView}>
            <View style={styles.bottomNavPartView}>
              {
                (this.state.currentPageIndex !== 0) &&
                <TouchableOpacity
                  style={styles.bottomNavTouchableView}
                  onPress={() => this.onPressPreviousPage()}>
                  <Image
                    style={styles.bottomNavTouchableImg}
                    source={leftArrowImg}
                    resizeMode="cover"
                  />
                  <Text style={styles.bottomNavTouchableText}>Prev</Text>
                </TouchableOpacity>
              }
            </View>

            <View style={styles.bottomNavPartView}>
              <Text style={styles.bottomNavTouchableText}>
                {this.state.currentPageIndex + 1}/{this.props.pages.length}
              </Text>
            </View>

            <View style={styles.bottomNavPartView}>
              {
                (this.state.currentPageIndex !== (this.props.pages.length - 1)) ?
                  <TouchableOpacity
                    style={styles.bottomNavTouchableView}
                    onPress={() => this.onPressNextPage()}>
                    <Text style={styles.bottomNavTouchableText}>Next</Text>
                    <Image
                      style={styles.bottomNavTouchableImg}
                      source={rightArrowImg}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity
                    style={styles.bottomNavTouchableView}
                    onPress={() => this.onPressMarkAsRead()}>
                    <Image
                      style={styles.markChapterAsReadImg}
                      source={asReadImg}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
              }
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor
  },
  readingChapterView: {
    flex: 1,
    backgroundColor: primaryColor,
    flexDirection: 'column'
  },
  bottomNavView: {
    height: bottomNavViewHeight,
    width: deviceSize.deviceWidth,
    backgroundColor: tertiaryColor,
    flexDirection: 'row',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomNavPartView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomNavTouchableView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center'
  },
  bottomNavTouchableImg: {
    width: bottomNavViewHeight * 0.8,
    height: bottomNavViewHeight * 0.8,
  },
  bottomNavTouchableText: {
    color: primaryColor,
    fontSize: 18,
  },
  markChapterAsReadImg: {
    width: bottomNavViewHeight * 0.95,
    height: bottomNavViewHeight * 0.95,
  }
});

ReadingChapterScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,

  connectivity: PropTypes.string.isRequired,
  userMail: PropTypes.string.isRequired,
  userPassword: PropTypes.string.isRequired,
  loadImageRatio: PropTypes.func.isRequired,

  pages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      page: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired
    })
  ),
  pagesError: PropTypes.string,
  pagesLoading: PropTypes.bool.isRequired,
  loadPages: PropTypes.func.isRequired,

  markChapterAsRead: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  connectivity: state.connect.connectivity,
  userMail: state.connect.userMail,
  userPassword: state.connect.userPassword,

  pages: state.manga.pages,
  pagesError: state.manga.pagesError,
  pagesLoading: state.manga.pagesLoading,
});
const mapDispatchToProps = dispatch => ({
  loadPages: (userMail, userPassword, manga, chapter) => dispatch(loadPages(userMail, userPassword, manga, chapter)),
  markChapterAsRead: (chapter, value) => dispatch(markChapterAsRead(chapter, value)),
  loadImageRatio: (url) => dispatch(loadImageRatio(url)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReadingChapterScreen);