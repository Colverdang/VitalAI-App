// app/components/languageSelector.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LanguageSelector = ({ visible, onClose, onLanguageSelect, currentLanguage }) => {
  const rsaLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇿🇦' },
    { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
    { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
    { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦' },
    { code: 'nso', name: 'Sepedi', nativeName: 'Sesotho sa Leboa', flag: '🇿🇦' },
    { code: 'tn', name: 'Setswana', nativeName: 'Setswana', flag: '🇿🇦' },
    { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', flag: '🇿🇦' },
    { code: 'ts', name: 'Xitsonga', nativeName: 'Xitsonga', flag: '🇿🇦' },
    { code: 'ss', name: 'SiSwati', nativeName: 'SiSwati', flag: '🇿🇦' },
    { code: 've', name: 'Tshivenda', nativeName: 'Tshivenda', flag: '🇿🇦' },
    { code: 'nr', name: 'isiNdebele', nativeName: 'isiNdebele', flag: '🇿🇦' },
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
          width: '90%',
          maxHeight: '70%'
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select Language / Khetha Ulwimi</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 15, textAlign: 'center' }}>
            South African Official Languages
          </Text>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {rsaLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                  backgroundColor: currentLanguage === language.code ? '#E8F4FF' : 'transparent',
                  borderRadius: 8,
                  marginBottom: 5,
                }}
                onPress={() => onLanguageSelect(language)}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>{language.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{language.name}</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>{language.nativeName}</Text>
                </View>
                {currentLanguage === language.code && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageSelector;