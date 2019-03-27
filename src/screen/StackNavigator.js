import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './HomeScreen';
import ChapterListScreen from './ChapterListScreen';
import ReadingChapterScreen from './ReadingChapterScreen';

const AppNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        Chapters: ChapterListScreen,
        Reading: ReadingChapterScreen
    },
    {
        initialRouteName: 'Home',
    },
);

export default AppContainer = createAppContainer(AppNavigator);