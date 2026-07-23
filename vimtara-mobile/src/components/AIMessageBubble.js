import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function AIMessageBubble({ content }) {
  
  // Custom function to open URLs safely in the phone's native browser
  const handleLinkPress = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Cannot open URL: " + url);
      }
    });
    return false; // Prevents default browser override issues
  };

  return (
    <View style={styles.bubbleContainer}>
      <Markdown 
        style={markdownStyles} 
        onLinkPress={handleLinkPress}
      >
        {content}
      </Markdown>
    </View>
  );
}

// --- CONTAINER STYLING ---
const styles = StyleSheet.create({
  bubbleContainer: {
    backgroundColor: '#1e1b4b', // Dark indigo theme
    borderColor: '#312e81',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4, // Distinct chat bubble corner
    maxWidth: '88%',
    marginVertical: 6,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
});

// --- MARKDOWN NODE STYLING ---
const markdownStyles = StyleSheet.create({
  // Base text styling
  body: {
    color: '#f8fafc',
    fontSize: 14,
    lineHeight: 22,
  },
  
  // Headings (### Heading)
  heading3: {
    color: '#c7d2fe',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#3730a3',
    paddingBottom: 4,
  },

  // Paragraphs
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },

  // Bold Text (**bold**)
  strong: {
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#312e81', // Subtle highlight badge
    paddingHorizontal: 4,
    borderRadius: 4,
  },

  // Lists (* or 1.)
  list_item: {
    marginVertical: 2,
  },
  bullet_list: {
    marginVertical: 6,
  },
  ordered_list: {
    marginVertical: 6,
  },
  bullet_list_icon: {
    color: '#818cf8',
    fontSize: 16,
  },

  // Hyperlinks ([Text](URL))
  link: {
    color: '#93c5fd',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  // Code blocks / inline code (if present)
  code_inline: {
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontFamily: 'Platform', // Uses default monospace font on system
  },
});