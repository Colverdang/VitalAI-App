// app/components/LanguageSelector.jsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles/LanguageSelector';

const { width, height } = Dimensions.get('window');

// All South African Official Languages
export const saLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'zu', name: 'isiZulu', nativeName: 'isiZulu' },
  { code: 'xh', name: 'isiXhosa', nativeName: 'isiXhosa' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho' },
  { code: 'tn', name: 'Setswana', nativeName: 'Setswana' },
  { code: 'ts', name: 'Xitsonga', nativeName: 'Xitsonga' },
  { code: 'ss', name: 'siSwati', nativeName: 'siSwati' },
  { code: 've', name: 'Tshivenda', nativeName: 'Tshivenda' },
  { code: 'nr', name: 'isiNdebele', nativeName: 'isiNdebele' }
];

const LanguageSelector = ({ visible, onClose, onLanguageSelect, currentLanguage, languages = saLanguages }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, width > 768 && styles.modalContentLarge]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.languageItem,
                  currentLanguage === item.code && styles.languageItemSelected
                ]}
                onPress={() => onLanguageSelect(item)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{item.name}</Text>
                  <Text style={styles.languageNative}>{item.nativeName}</Text>
                </View>
                {currentLanguage === item.code && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            )}
            style={styles.languageList}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LanguageSelector;