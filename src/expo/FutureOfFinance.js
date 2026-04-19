import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';

const { width } = Dimensions.get('window');

const FutureOfFinance = () => {
  const handleLearnMore = () => {
    Linking.openURL('https://sovereignvault.com'); // Replace with actual SovereignVault URL
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/800x400/2E86AB/FFFFFF?text=SovereignVault' }} // Replace with actual hero image URL
          style={styles.heroImage}
          resizeMode="cover"
        />
        <Text style={styles.heroTitle}>The Future of Finance is Here.</Text>
        <Text style={styles.heroSubtitle}>
          Embrace the Architect. Disrupt the Old Guard. SovereignVault is rewriting the rules.
        </Text>
      </View>

      {/* Vision Statement */}
      <View style={styles.visionSection}>
        <Text style={styles.visionTitle}>Our Vision</Text>
        <Text style={styles.visionText}>
          We envision a world where financial power is decentralized, transparent, and accessible to all. SovereignVault is building the infrastructure for this new era, empowering individuals and organizations to control their financial destiny. We are not just building a platform; we are building a movement.
        </Text>
      </View>

      {/* Key Features */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Key Features</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Decentralized Control</Text>
          <Text style={styles.featureText}>
            Take control of your assets with our secure, decentralized platform. No more intermediaries, no more gatekeepers.
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Smart Contracts</Text>
          <Text style={styles.featureText}>
            Automate your financial agreements with powerful, customizable smart contracts. Execute deals with confidence and transparency.
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Global Access</Text>
          <Text style={styles.featureText}>
            Access global markets and opportunities from anywhere in the world. Break down barriers and unlock new possibilities.
          </Text>
        </View>
      </View>

      {/* Call to Action */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Join the Revolution?</Text>
        <TouchableOpacity style={styles.ctaButton} onPress={handleLearnMore}>
          <Text style={styles.ctaButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} SovereignVault. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  heroImage: {
    width: width - 40,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  visionSection: {
    padding: 20,
  },
  visionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  visionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  featuresSection: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featureItem: {
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  ctaSection: {
    padding: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#2E86AB',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  footerText: {
    fontSize: 14,
    color: '#777',
  },
});

export default FutureOfFinance;