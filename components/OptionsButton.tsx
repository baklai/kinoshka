import StyledIcon from '@/components/StyledIcon';
import { scaledPixels } from '@/hooks/useScaledPixels';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SortableButtonProps {}

export default function OptionsButton() {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <View style={{ position: 'relative' }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={openModal}>
            <StyledIcon name="dots-vertical" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={closeModal}>
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Відеоплеєр</Text>
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
  }
});
