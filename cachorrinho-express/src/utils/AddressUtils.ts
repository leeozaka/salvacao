/**
 * Utility class for handling address-related operations
 */
export default class AddressUtils {
  private static readonly POSTAL_CODE_LENGTH = 8;
  private static readonly POSTAL_CODE_REGEX = /^[\d]{8}$/;

  /**
   * Validates if a given postal code (CEP) is in the correct format
   * @param postalCode - The postal code to validate (can include special characters)
   * @returns true if valid, throws error if invalid
   * @example
   * // Returns true
   * AddressUtils.isValidPostalCode("12345-678")
   * // Throws error
   * AddressUtils.isValidPostalCode("123")
   */
  static isValidPostalCode(postalCode: string): boolean {
    if (!postalCode?.trim()) 
      throw new Error('Postal code cannot be empty or null');

    const cleanPostalCode = this.sanitizePostalCode(postalCode);

    if (!this.POSTAL_CODE_REGEX.test(cleanPostalCode))
      throw new Error(`Postal code must contain exactly ${this.POSTAL_CODE_LENGTH} digits`);

    return true;
  }

  /**
   * Removes all non-digit characters from the postal code
   */
  private static sanitizePostalCode(postalCode: string): string {
    return postalCode.replace(/\D/g, '');
  }
}
