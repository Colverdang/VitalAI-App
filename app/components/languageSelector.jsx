// app/components/languageSelector.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LanguageSelector = ({ visible, onClose, onLanguageSelect }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        <View style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 15,
          width: '80%',
          maxHeight: '60%'
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select Language</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0'
              }}
              onPress={() => onLanguageSelect(language)}
            >
              <Text style={{ fontSize: 20, marginRight: 15 }}>{language.flag}</Text>
              <Text style={{ fontSize: 16 }}>{language.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default LanguageSelector;