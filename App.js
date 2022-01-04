import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ModalPortal } from 'react-native-modals';
import { View } from 'react-native';

import Welcome from './components/views/Welcome.js';
import Join from './components/views/Join.js';
import Create from './components/views/Create.js';
import Lobby from './components/views/Lobby.js';
import ActiveGame from './components/views/ActiveGame.js';

const Stack = createStackNavigator();

const App = () => (
  
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: "#2f173d" }}>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Join" component={Join} />
          <Stack.Screen name="Create" component={Create} />
          <Stack.Screen name="Lobby" component={Lobby} />
          <Stack.Screen name="ActiveGame" component={ActiveGame} />
        </Stack.Navigator>
      </View>
      <ModalPortal/>
    </NavigationContainer>
);

export default App;
