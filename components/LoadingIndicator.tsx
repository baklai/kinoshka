import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingIndicator = () => {
  const styles = useLoadingIndicatorStyles();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

const useLoadingIndicatorStyles = () => {
  return StyleSheet.create({
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });
};

export default LoadingIndicator;
