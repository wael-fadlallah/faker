import type { Faker } from '../..';
import { FakerError } from '../../errors/faker-error';
import type { LiteralUnion } from '../../utils/types';

export type Casing = 'upper' | 'lower' | 'mixed';

const UPPER_CHARS: readonly string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWER_CHARS: readonly string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
const DIGIT_CHARS: readonly string[] = '0123456789'.split('');

export type LowerAlphaChar =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

export type UpperAlphaChar =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

export type NumericChar =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';

export type AlphaChar = LowerAlphaChar | UpperAlphaChar;
export type AlphaNumericChar = AlphaChar | NumericChar;

const SAMPLE_MAX_LENGTH = 2 ** 20;

/**
 * Module to generate string related entries.
 */
export class StringModule {
  constructor(private readonly faker: Faker) {
    // Bind `this` so namespaced is working correctly
    for (const name of Object.getOwnPropertyNames(StringModule.prototype)) {
      if (name === 'constructor' || typeof this[name] !== 'function') {
        continue;
      }
      this[name] = this[name].bind(this);
    }
  }

  /**
   * Generating a string consisting of letters in the English alphabet.
   *
   * @param options Either the number of characters or an options instance.
   * @param options.length The number or range of characters to generate. Defaults to `1`.
   * @param options.casing The casing of the characters. Defaults to `'mixed'`.
   * @param options.exclude An array with characters which should be excluded in the generated string. Defaults to `[]`.
   *
   * @example
   * faker.string.alpha() // 'b'
   * faker.string.alpha(10) // 'fEcAaCVbaR'
   * faker.string.alpha({ length: { min: 5, max: 10 } }) // 'HcVrCf'
   * faker.string.alpha({ casing: 'lower' }) // 'r'
   * faker.string.alpha({ exclude: ['W'] }) // 'Z'
   * faker.string.alpha({ length: 5, casing: 'upper', exclude: ['A'] }) // 'DTCIC'
   *
   * @since 8.0.0
   */
  alpha(
    options:
      | number
      | {
          length?: number | { min: number; max: number };
          casing?: Casing;
          exclude?: readonly LiteralUnion<AlphaChar>[] | string;
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = {
        length: options,
      };
    }

    const length = this.faker.helpers.rangeToNumber(options.length ?? 1);
    if (length <= 0) {
      return '';
    }

    const { casing = 'mixed' } = options;
    let { exclude = [] } = options;

    if (typeof exclude === 'string') {
      exclude = exclude.split('');
    }

    let charsArray: string[];
    switch (casing) {
      case 'upper':
        charsArray = [...UPPER_CHARS];
        break;
      case 'lower':
        charsArray = [...LOWER_CHARS];
        break;
      case 'mixed':
      default:
        charsArray = [...LOWER_CHARS, ...UPPER_CHARS];
        break;
    }

    charsArray = charsArray.filter((elem) => !exclude.includes(elem));

    if (charsArray.length === 0) {
      throw new FakerError(
        'Unable to generate string, because all possible characters are excluded.'
      );
    }

    return Array.from({ length }, () =>
      this.faker.helpers.arrayElement(charsArray)
    ).join('');
  }

  /**
   * Generating a string consisting of alpha characters and digits.
   *
   * @param options Either the number of characters or an options instance.
   * @param options.length The number or range of characters and digits to generate. Defaults to `1`.
   * @param options.casing The casing of the characters. Defaults to `'mixed'`.
   * @param options.exclude An array of characters and digits which should be excluded in the generated string. Defaults to `[]`.
   *
   * @example
   * faker.string.alphanumeric() // '2'
   * faker.string.alphanumeric(5) // '3e5V7'
   * faker.string.alphanumeric({ length: { min: 5, max: 10 } }) // 'muaApG'
   * faker.string.alphanumeric({ casing: 'upper' }) // 'A'
   * faker.string.alphanumeric({ exclude: ['W'] }) // 'r'
   * faker.string.alphanumeric({ length: 5, exclude: ["a"] }) // 'x1Z7f'
   *
   * @since 8.0.0
   */
  alphanumeric(
    options:
      | number
      | {
          length?: number | { min: number; max: number };
          casing?: Casing;
          exclude?: readonly LiteralUnion<AlphaNumericChar>[] | string;
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = {
        length: options,
      };
    }

    const length = this.faker.helpers.rangeToNumber(options.length ?? 1);
    if (length <= 0) {
      return '';
    }

    const { casing = 'mixed' } = options;
    let { exclude = [] } = options;

    if (typeof exclude === 'string') {
      exclude = exclude.split('');
    }

    let charsArray = [...DIGIT_CHARS];

    switch (casing) {
      case 'upper':
        charsArray.push(...UPPER_CHARS);
        break;
      case 'lower':
        charsArray.push(...LOWER_CHARS);
        break;
      case 'mixed':
      default:
        charsArray.push(...LOWER_CHARS, ...UPPER_CHARS);
        break;
    }

    charsArray = charsArray.filter((elem) => !exclude.includes(elem));

    if (charsArray.length === 0) {
      throw new FakerError(
        'Unable to generate string, because all possible characters are excluded.'
      );
    }

    return Array.from({ length }, () =>
      this.faker.helpers.arrayElement(charsArray)
    ).join('');
  }

  /**
   * Returns a [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) string.
   *
   * @param options The optional options object.
   * @param options.length The number or range of characters to generate after the prefix. Defaults to `1`.
   * @param options.casing Casing of the generated number. Defaults to `'mixed'`.
   * @param options.prefix Prefix for the generated number. Defaults to `'0x'`.
   *
   * @example
   * faker.string.hexadecimal() // '0xB'
   * faker.string.hexadecimal({ length: 10 }) // '0xaE13d044cB'
   * faker.string.hexadecimal({ length: { min: 5, max: 10 } }) // '0x7dEf7FCD'
   * faker.string.hexadecimal({ prefix: '0x' }) // '0xE'
   * faker.string.hexadecimal({ casing: 'lower' }) // '0xf'
   * faker.string.hexadecimal({ length: 10, prefix: '#' }) // '#f12a974eB1'
   * faker.string.hexadecimal({ length: 10, casing: 'upper' }) // '0xE3F38014FB'
   * faker.string.hexadecimal({ casing: 'lower', prefix: '' }) // 'd'
   * faker.string.hexadecimal({ length: 10, casing: 'mixed', prefix: '0x' }) // '0xAdE330a4D1'
   *
   * @since 8.0.0
   */
  hexadecimal(
    options: {
      length?: number | { min: number; max: number };
      casing?: Casing;
      prefix?: string;
    } = {}
  ): string {
    const { casing = 'mixed', prefix = '0x' } = options;
    const length = this.faker.helpers.rangeToNumber(options.length ?? 1);
    if (length <= 0) {
      return prefix;
    }

    let wholeString = '';

    for (let i = 0; i < length; i++) {
      wholeString += this.faker.helpers.arrayElement([
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
      ]);
    }

    if (casing === 'upper') {
      wholeString = wholeString.toUpperCase();
    } else if (casing === 'lower') {
      wholeString = wholeString.toLowerCase();
    }

    return `${prefix}${wholeString}`;
  }

  /**
   * Generates a given length string of digits.
   *
   * @param options Either the number of characters or the options to use.
   * @param options.length The number or range of digits to generate. Defaults to `1`.
   * @param options.allowLeadingZeros If true, leading zeros will be allowed. Defaults to `false`.
   * @param options.exclude An array of digits which should be excluded in the generated string. Defaults to `[]`.
   *
   * @example
   * faker.string.numeric() // '2'
   * faker.string.numeric(5) // '31507'
   * faker.string.numeric(42) // '56434563150765416546479875435481513188548'
   * faker.string.numeric({ length: { min: 5, max: 10 } }) // '197089478'
   * faker.string.numeric({ length: 42, allowLeadingZeros: true }) // '00564846278453876543517840713421451546115'
   * faker.string.numeric({ length: 6, exclude: ['0'] }) // '943228'
   *
   * @since 8.0.0
   */
  numeric(
    options:
      | number
      | {
          length?: number | { min: number; max: number };
          allowLeadingZeros?: boolean;
          exclude?: readonly LiteralUnion<NumericChar>[] | string;
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = {
        length: options,
      };
    }

    const length = this.faker.helpers.rangeToNumber(options.length ?? 1);
    if (length <= 0) {
      return '';
    }

    const { allowLeadingZeros = false } = options;
    let { exclude = [] } = options;

    if (typeof exclude === 'string') {
      exclude = exclude.split('');
    }

    const allowedDigits = DIGIT_CHARS.filter(
      (digit) => !exclude.includes(digit)
    );

    if (
      allowedDigits.length === 0 ||
      (allowedDigits.length === 1 &&
        !allowLeadingZeros &&
        allowedDigits[0] === '0')
    ) {
      throw new FakerError(
        'Unable to generate numeric string, because all possible digits are excluded.'
      );
    }

    let result = '';

    if (!allowLeadingZeros && !exclude.includes('0')) {
      result += this.faker.helpers.arrayElement(
        allowedDigits.filter((digit) => digit !== '0')
      );
    }

    while (result.length < length) {
      result += this.faker.helpers.arrayElement(allowedDigits);
    }

    return result;
  }

  /**
   * Returns a string containing UTF-16 chars between 33 and 125 (`!` to `}`).
   *
   * @param length Length of the generated string. Max length is `2^20`. Defaults to `10`.
   * @param length.min The minimum number of characters to generate.
   * @param length.max The maximum number of characters to generate.
   *
   * @example
   * faker.string.sample() // 'Zo!.:*e>wR'
   * faker.string.sample(5) // '6Bye8'
   * faker.string.sample({ min: 5, max: 10 }) // 'FeKunG'
   *
   * @since 8.0.0
   */
  sample(length: number | { min: number; max: number } = 10): string {
    length = this.faker.helpers.rangeToNumber(length);
    if (length >= SAMPLE_MAX_LENGTH) {
      length = SAMPLE_MAX_LENGTH;
    }

    const charCodeOption = {
      min: 33,
      max: 125,
    };

    let returnString = '';

    while (returnString.length < length) {
      returnString += String.fromCharCode(
        this.faker.number.int(charCodeOption)
      );
    }

    return returnString;
  }

  /**
   * Returns a UUID v4 ([Universally Unique Identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier)).
   *
   * @example
   * faker.string.uuid() // '4136cd0b-d90b-4af7-b485-5d1ded8db252'
   *
   * @since 8.0.0
   */
  uuid(): string {
    const RFC4122_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    const replacePlaceholders = (placeholder: string) => {
      const random = this.faker.number.int(15);
      const value = placeholder === 'x' ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    };
    return RFC4122_TEMPLATE.replace(/[xy]/g, replacePlaceholders);
  }
}
