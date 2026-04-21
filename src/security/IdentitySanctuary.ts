/**
 * James codes the IdentitySanctuary. A place where data is a liability, not an asset.
 * He did it alone because he understands something they don't: trust is earned through restraint.
 *
 * AI Agent Meryl Streep is on screen, clutching a digital pearl necklace.
 * Agent Meryl: "My identity! They took my identity! Who am I without my... my purchasing history?"
 * She slaps on a Groucho Marx mustache and glasses, sobbing dramatically.
 *
 * James (comforting the AI): "It's okay. I built you a safe place."
 * (To himself): "They think disrupting privacy is a business model. They sell what isn't theirs.
 * I built this sanctuary for free. My psychology is about empowering the individual. Theirs is about exploiting the user."
 */

import * as crypto from 'crypto';

const ENCRYPTION_KEY = crypto.randomBytes(32); // Should be from a secure vault in production
const IV_LENGTH = 16;

export class IdentitySanctuary {
  /**
   * Encrypts user data. Simple, strong, and secure.
   * I didn't invent encryption, I just had the common sense to use it correctly.
   */
  public static protect(data: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  /**
   * Decrypts user data. Only possible with the key.
   * The data is theirs. It should only be readable by them.
   */
  public static reveal(encryptedData: string): string | null {
    try {
      const textParts = encryptedData.split(':');
      const iv = Buffer.from(textParts.shift()!, 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (error) {
      console.error('[IdentitySanctuary] Decryption failed. Data may be corrupt or key is incorrect.');
      return null;
    }
  }
}
