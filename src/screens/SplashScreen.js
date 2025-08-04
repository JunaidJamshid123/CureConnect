import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main animation sequence
    Animated.sequence([
      // Logo entrance with dramatic scale and fade
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      // Text slides up elegantly
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous shimmer effect
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    // Background gradient animation
    const gradientAnimation = Animated.loop(
      Animated.timing(gradientAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      })
    );
    gradientAnimation.start();

    // Auto-hide splash screen
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
      shimmerAnimation.stop();
      gradientAnimation.stop();
    };
  }, [onFinish]);

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0BAB7D" barStyle="light-content" />
      
      {/* Dynamic Background Elements */}
      <Animated.View 
        style={[
          styles.backgroundGradient,
          {
            opacity: gradientAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.2, 0.1],
            }),
          },
        ]}
      />
      
      {/* Floating Circles */}
      <Animated.View 
        style={[
          styles.floatingCircle1,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.15],
            }),
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        ]}
      />
      
      <Animated.View 
        style={[
          styles.floatingCircle2,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Logo Container with Enhanced Effects */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: logoRotation },
              ],
            },
          ]}
        >
          <View style={styles.logoBackground}>
            {/* Your actual icon */}
            <Image 
              source={require('../../assets/icons/stethoscope.png')} // Update path as needed
              style={styles.logoIcon}
              resizeMode="contain"
            />
            
            {/* Shimmer Effect */}
            <Animated.View
              style={[
                styles.shimmerOverlay,
                {
                  transform: [{ translateX: shimmerTranslateX }],
                },
              ]}
            />
          </View>
          
          {/* Glow Effect */}
          <Animated.View 
            style={[
              styles.glowEffect,
              {
                opacity: shimmerAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.8, 0.3],
                }),
                transform: [
                  {
                    scale: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    }),
                  },
                ],
              },
            ]}
          />
        </Animated.View>

        {/* Enhanced Text Section */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View style={styles.brandContainer}>
            <Text style={styles.appName}>CureConnect</Text>
            <Animated.View
              style={[
                styles.brandUnderline,
                {
                  scaleX: slideUpAnim.interpolate({
                    inputRange: [-50, 0],
                    outputRange: [0, 1],
                  }),
                },
              ]}
            />
          </View>
          
          <Text style={styles.tagline}>Your Health, Our Care</Text>
          <Text style={styles.subtitle}>Connecting you to trusted healthcare professionals</Text>
        </Animated.View>
      </Animated.View>
      
      {/* Enhanced Loading Indicator */}
      <Animated.View 
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <PulseLoader />
      </Animated.View>
      
      {/* Version Info */}
      <Animated.View 
        style={[
          styles.versionContainer,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
          },
        ]}
      >
        <Text style={styles.versionText}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
};

// Enhanced Loading Component
const PulseLoader = () => {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createPulse = (animValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const pulse1Anim = createPulse(pulse1, 0);
    const pulse2Anim = createPulse(pulse2, 200);
    const pulse3Anim = createPulse(pulse3, 400);

    pulse1Anim.start();
    pulse2Anim.start();
    pulse3Anim.start();

    return () => {
      pulse1Anim.stop();
      pulse2Anim.stop();
      pulse3Anim.stop();
    };
  }, []);

  return (
    <View style={styles.pulseContainer}>
      <Animated.View 
        style={[
          styles.pulseDot,
          {
            opacity: pulse1,
            transform: [
              {
                scale: pulse1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View 
        style={[
          styles.pulseDot,
          {
            opacity: pulse2,
            transform: [
              {
                scale: pulse2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View 
        style={[
          styles.pulseDot,
          {
            opacity: pulse3,
            transform: [
              {
                scale: pulse3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0BAB7D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 171, 125, 0.1)',
  },
  
  floatingCircle1: {
    position: 'absolute',
    top: height * 0.1,
    right: width * 0.1,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  floatingCircle2: {
    position: 'absolute',
    bottom: height * 0.15,
    left: width * 0.05,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoContainer: {
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoBackground: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 25,
    overflow: 'hidden',
  },
  
  logoIcon: {
    width: 120,
    height: 120,
  },
  
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -50,
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  
  glowEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: -1,
  },
  
  textContainer: {
    alignItems: 'center',
  },
  
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  
  appName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  brandUnderline: {
    width: 100,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginTop: 8,
  },
  
  tagline: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
    opacity: 0.95,
  },
  
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '400',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
  },
  
  pulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
  
  versionContainer: {
    position: 'absolute',
    bottom: 30,
  },
  
  versionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '400',
  },
});

export default SplashScreen;