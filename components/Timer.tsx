import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Audio } from 'expo-av';

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      playBuzzer();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsActive(true);
  };

  const addMinute = () => {
    if (isActive) {
      setTimeLeft(time => time + 60);
    } else {
      startTimer(1);
    }
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const playBuzzer = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/buzzer.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  const isLandscape = dimensions.width > dimensions.height;
  const timerSize = isLandscape ? 
    Math.min(dimensions.width, dimensions.height) * 0.5 : 
    Math.min(dimensions.width, dimensions.height) * 0.35;

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.timerText, { fontSize: timerSize }]}>
          {formatTime(timeLeft)}
        </Text>
      </View>
      <View style={styles.controlsContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, timeLeft === 5 * 60 && isActive && styles.activeButton]} 
            onPress={() => startTimer(5)}
          >
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, timeLeft === 6 * 60 && isActive && styles.activeButton]} 
            onPress={() => startTimer(6)}
          >
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, timeLeft === 7 * 60 && isActive && styles.activeButton]} 
            onPress={() => startTimer(7)}
          >
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.addButton]} 
            onPress={addMinute}
          >
            <Text style={styles.buttonText}>+1</Text>
          </TouchableOpacity>
        </View>
        {isActive && (
          <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
            <Text style={[styles.buttonText, styles.stopButtonText]}>⏹️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  timerContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  timerText: {
    fontWeight: 'bold',
    color: '#fff',
    width: '100%',
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingBottom: 20,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#ff0000',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  addButton: {
    backgroundColor: '#3498db',
  },
});

export default Timer;

