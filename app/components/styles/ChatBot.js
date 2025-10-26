import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },

  // Navigation Bar
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#F8F9FF',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  navTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },

  // Messages
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 6,
    padding: 16,
    borderRadius: 18,
    maxWidth: '85%',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  botAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  welcomeMessage: {
    backgroundColor: '#E8F4FF',
    borderColor: '#D0E8FF',
  },
  emergencyMessage: {
    backgroundColor: '#FFE8E8',
    borderColor: '#FFD0D0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botMessageText: {
    color: '#1A1A1A',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  emergencyText: {
    color: '#D70015',
    fontWeight: '600',
  },
  departmentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 6,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  departmentTagText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },

  // Quick Actions
  quickActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  quickActionsScroll: {
    flexDirection: 'row',
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8EFFF',
  },
  quickActionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },

  // Input Container
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },

  // Tab Content
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  tabSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  // Modals
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: width - 40,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  optionButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  optionButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    textAlign: 'center',
  },
  departmentList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E8ECF0',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    textAlign: 'center',
    flex: 1,
  },
});