import StyledIcon from '@/components/StyledIcon';
import { scaledPixels } from '@/hooks/useScaledPixels';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SortableButtonProps {
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  fields: string[];
}

export default function SortableButton({ onSort, fields }: SortableButtonProps) {
  const [sortedField, setSortedField] = useState<string>(fields[0]);
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleDirection = () => {
    const newDir = direction === 'asc' ? 'desc' : 'asc';
    setDirection(newDir);
    onSort?.(sortedField, newDir);
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleFieldSelect = (field: string) => {
    setSortedField(field);
    onSort?.(field, direction);
    closeModal();
  };

  return (
    <>
      <View style={{ position: 'relative' }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={toggleDirection} onLongPress={openModal}>
            <StyledIcon name={direction === 'asc' ? 'sort-ascending' : 'sort-descending'} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={closeModal}>
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Виберіть поле для сортування</Text>
            {fields.map(field => (
              <Pressable
                key={field}
                style={styles.menuItem}
                onPress={() => handleFieldSelect(field)}
              >
                <View style={styles.radioOuter}>
                  {sortedField === field && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.menuItemText}>{field}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: scaledPixels(8),
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: '#17171A',
    paddingVertical: scaledPixels(10),
    paddingHorizontal: scaledPixels(10)
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: scaledPixels(20)
  },
  modalContent: {
    backgroundColor: '#1B1C1E',
    borderRadius: scaledPixels(8),
    padding: scaledPixels(16),
    width: '100%',
    maxWidth: scaledPixels(600)
  },
  modalTitle: {
    color: '#fff',
    fontSize: scaledPixels(16),
    marginBottom: scaledPixels(12)
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaledPixels(8),
    paddingHorizontal: scaledPixels(12),
    borderRadius: scaledPixels(6)
  },
  menuItemText: {
    color: '#fff',
    fontSize: scaledPixels(14)
  },
  radioOuter: {
    width: scaledPixels(18),
    height: scaledPixels(18),
    borderRadius: scaledPixels(9),
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaledPixels(8)
  },
  radioInner: {
    width: scaledPixels(10),
    height: scaledPixels(10),
    borderRadius: scaledPixels(5),
    backgroundColor: '#fff'
  }
});
