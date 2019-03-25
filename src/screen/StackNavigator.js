import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './HomeScreen';
import ReadingScreen from './ReadingScreen';

const AppNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        Reading: ReadingScreen,
    },
    {
        initialRouteName: 'Home',
    },
);

export default AppContainer = createAppContainer(AppNavigator);