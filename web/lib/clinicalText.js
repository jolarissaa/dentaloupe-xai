/**
 * House style for numbers and punctuation in the advisory documents, as the doctor asked:
 * no decimals (ratios become whole percentages) and no semicolons.
 *
 *   rasio 0,289        → rasio 29%
 *   ±11,8% area        → ±12% area
 *   …dentin; pola ini  → …dentin. Pola ini
 *
 * ICD-10 codes such as K02.1 are left alone (the decimal follows a letter). The prompts ask the
 * model for this style too; this keeps documents already written, or a model that slips,
 * consistent. Verbatim source quotes must never pass through here.
 */

const DECIMAL_PERCENT = /(?<![\w.,])(\d+)[.,](\d+)\s*%/g;
const RATIO = /(?<![\w.,])0[.,](\d{1,4})(?![\d%]|\s*%)/g;
const SEMICOLON = /;[ \t]+(\**_?)(\S)/g;
const SEMICOLON_AT_END = /;[ \t]*$/gm;

export function humanizeClinicalText(text) {
  return String(text ?? "")
    .replace(DECIMAL_PERCENT, (_, a, b) => `${Math.round(Number(`${a}.${b}`))}%`)
    .replace(RATIO, (_, d) => `${Math.round(Number(`0.${d}`) * 100)}%`)
    .replace(SEMICOLON, (_, lead, c) => `. ${lead}${c.toUpperCase()}`)
    .replace(SEMICOLON_AT_END, ".");
}
