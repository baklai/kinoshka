import { scaledPixels } from '@/hooks/useScaledPixels';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  episodes?: string[];
  onPlay: (episode?: string) => void;
}

export default function DropdownButton({ episodes = [], onPlay }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (episode?: string) => {
    setOpen(false);
    onPlay(episode);
  };

  if (episodes.length <= 1) {
    return (
      <TouchableOpacity style={styles.playButton} onPress={() => handleSelect(episodes[0])}>
        <Ionicons name="play" size={18} color="#fff" />
        <Text style={styles.playButtonText}>Дивитись відео</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity style={styles.playButton} onPress={() => setOpen(prev => !prev)}>
        <Ionicons name="play" size={18} color="#fff" />
        <Text style={styles.playButtonText}>Дивитись відео</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#fff"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <FlatList
            data={episodes}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelect(item)}>
                <Text style={styles.dropdownText}>Серія {index + 1}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ca563f',
    paddingHorizontal: scaledPixels(14),
    paddingVertical: scaledPixels(8),
    borderRadius: scaledPixels(6)
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: scaledPixels(6)
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30,30,30,0.95)',
    borderRadius: scaledPixels(6),
    marginTop: 4,
    zIndex: 10
  },
  dropdownItem: {
    paddingHorizontal: scaledPixels(12),
    paddingVertical: scaledPixels(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  dropdownText: {
    color: '#fff',
    fontSize: scaledPixels(16)
  }
});
