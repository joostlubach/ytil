import { randomBytes } from 'crypto'

export class SecureRandom {

  constructor(
    size: number,
  ) {
    this.bytes = randomBytes(size)
  }

  private readonly bytes: Buffer

  /**
   * Generates a random string of hexadecimal characters.
   */
  public hex() {
    return this.bytes.toString('hex')
  }

  /**
   * Generates a random string using the given alphabet. The alphabet may not be larger than 256 characters.
   */
  public alphabet(alphabet: string) {
    return this.bytes.reduce((result, byte) => {
      return result + alphabet[byte % alphabet.length]
    }, '')
  }

}