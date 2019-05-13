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
import { colors } from '../colors';
import PageView from '../component/PageView';
import { images } from '../images';
import { deviceSize } from '../size';
import { NavBackButton } from '../component/NavBackButton';

let headerHeight = Header.HEIGHT;
let availableHeight = deviceSize.deviceHeight - headerHeight;
let pageViewHeight = availableHeight * 0.9;
let bottomNavViewHeight = availableHeight * 0.1;

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  readingChapterView: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'column',
  },
  bottomNavView: {
    height: bottomNavViewHeight,
    width: deviceSize.deviceWidth,
    backgroundColor: colors.tertiary,
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
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  markChapterAsReadImg: {
    width: bottomNavViewHeight * 0.95,
    height: bottomNavViewHeight * 0.95,
  }
});

export class ReadingChapterScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Chapter ' + navigation.getParam('chapter', 'none').number,
      headerTitleStyle: {
        color: colors.primary,
        fontSize: 22,
        fontWeight: 'bold',
      },
      headerStyle: { backgroundColor: colors.secondary },
      headerLeft: <NavBackButton navigation={navigation}/>,
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
      this.props.loadImageRatio(this.state.chapter.pages[0].url);
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
    if (this.state.currentPageIndex != (this.state.chapter.pages.length - 1)) {
      this.setState({
        currentPageIndex: this.state.currentPageIndex + 1
      });
      this.props.loadImageRatio(this.state.chapter.pages[this.state.currentPageIndex + 1].url);
    }
  }

  onPressPreviousPage() {
    if (this.state.currentPageIndex != 0) {
      this.setState({
        currentPageIndex: this.state.currentPageIndex - 1
      });
      this.props.loadImageRatio(this.state.chapter.pages[this.state.currentPageIndex - 1].url);
    }
  }

  onPressMarkAsRead() {
    this.props.markChapterAsRead(this.state.manga, this.state.chapter.id, true)
      .then(() => this.props.navigation.navigate('Chapters'));
  }

  render() {

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
                  source={images.leftArrow}
                  resizeMode="cover"
                />
                <Text style={styles.bottomNavTouchableText}>Prev</Text>
              </TouchableOpacity>
            }
          </View>

          <View style={styles.bottomNavPartView}>
            <Text style={styles.bottomNavTouchableText}>
              {this.state.currentPageIndex + 1}/{this.state.chapter.pages.length}
            </Text>
          </View>

          <View style={styles.bottomNavPartView}>
            {
              (this.state.currentPageIndex !== (this.state.chapter.pages.length - 1)) ?
                <TouchableOpacity
                  style={styles.bottomNavTouchableView}
                  onPress={() => this.onPressNextPage()}>
                  <Text style={styles.bottomNavTouchableText}>Next</Text>
                  <Image
                    style={styles.bottomNavTouchableImg}
                    source={images.rightArrow}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                :
                <TouchableOpacity
                  style={styles.bottomNavTouchableView}
                  onPress={() => this.onPressMarkAsRead()}>
                  <Image
                    style={styles.markChapterAsReadImg}
                    source={images.asRead}
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

ReadingChapterScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,

  connectivity: PropTypes.string.isRequired,
  userMail: PropTypes.string.isRequired,
  userPassword: PropTypes.string.isRequired,
  loadImageRatio: PropTypes.func.isRequired,

  markChapterAsRead: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  connectivity: state.connect.connectivity,
  userMail: state.connect.userMail,
  userPassword: state.connect.userPassword,
});
const mapDispatchToProps = dispatch => ({
  markChapterAsRead: (manga, chapter, value) => dispatch(markChapterAsRead(manga, chapter, value)),
  loadImageRatio: (url) => dispatch(loadImageRatio(url)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReadingChapterScreen);