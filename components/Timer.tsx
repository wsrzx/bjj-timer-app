import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsActive(true);
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

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => startTimer(5)}>
          <Text style={styles.buttonText}>5 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => startTimer(6)}>
          <Text style={styles.buttonText}>6 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => startTimer(7)}>
          <Text style={styles.buttonText}>7 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => startTimer(10)}>
          <Text style={styles.buttonText}>10 min</Text>
        </TouchableOpacity>
      </View>
      {isActive && (
        <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
          <Text style={styles.buttonText}>Parar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#ff0000',
    padding: 15,
    margin: 10,
    borderRadius: 5,
  },
});

export default Timer;

