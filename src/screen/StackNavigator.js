import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './HomeScreen';
import ChapterListScreen from './ChapterListScreen';

const AppNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        Chapters: ChapterListScreen,
    },
    {
        initialRouteName: 'Home',
    },
);

export default AppContainer = createAppContainer(AppNavigator);