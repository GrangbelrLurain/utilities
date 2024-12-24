import { z } from 'zod';
import { createCodes } from './code';

export const ENCODES = {
  'node.js': createCodes([
    { code: 'utf8', name: 'UTF-8' },
    { code: 'cesu8', name: 'CESU-8' },
    { code: 'ucs2', name: 'UCS-2' },
    { code: 'utf16le', name: 'UTF-16LE' },
    { code: 'ascii', name: 'ASCII' },
    { code: 'binary', name: 'Binary' },
    { code: 'base64', name: 'Base64' },
    { code: 'hex', name: 'Hex' },
  ]),
  unicode: createCodes([
    { code: 'utf7', name: 'UTF7' },
    { code: 'utf7imap', name: 'UTF7-IMAP' },
    { code: 'utf16be', name: 'UTF-16BE' },
    { code: 'utf16', name: 'UTF-16' },
    { code: 'ucs4', name: 'UCS-4' },
    { code: 'utf32', name: 'UTF-32' },
    { code: 'utf32le', name: 'UTF-32LE' },
    { code: 'utf32be', name: 'UTF-32BE' },
  ]),
  windows: createCodes([
    { code: '874', name: '874' },
    { code: '1250', name: '1250' },
    { code: '1251', name: '1251' },
    { code: '1252', name: '1252' },
    { code: '1253', name: '1253' },
    { code: '1254', name: '1254' },
    { code: '1255', name: '1255' },
    { code: '1256', name: '1256' },
    { code: '1257', name: '1257' },
    { code: '1258', name: '1258' },
  ]),
  iso: createCodes(
    Array.from({ length: 15 }, (_, i) => {
      let index = i + 1;
      if (index >= 12) {
        index = i + 2;
      }
      return {
        code: `iso-8859-${index}`,
        name: `ISO-8859-${index}`,
      };
    }),
  ),
  ibm: createCodes([
    { code: 'cp437', name: 'CP-437' },
    { code: 'cp720', name: 'CP-720' },
    { code: 'cp737', name: 'CP-737' },
    { code: 'cp775', name: 'CP-775' },
    { code: 'cp808', name: 'CP-808' },
    { code: 'cp850', name: 'CP-850' },
    { code: 'cp852', name: 'CP-852' },
    { code: 'cp855', name: 'CP-855' },
    { code: 'cp856', name: 'CP-856' },
    { code: 'cp857', name: 'CP-857' },
    { code: 'cp858', name: 'CP-858' },
    { code: 'cp860', name: 'CP-860' },
    { code: 'cp861', name: 'CP-861' },
    { code: 'cp862', name: 'CP-862' },
    { code: 'cp863', name: 'CP-863' },
    { code: 'cp864', name: 'CP-864' },
    { code: 'cp865', name: 'CP-865' },
    { code: 'cp866', name: 'CP-866' },
    { code: 'cp869', name: 'CP-869' },
    { code: 'cp922', name: 'CP-922' },
    { code: 'cp1046', name: 'CP-1046' },
    { code: 'cp1124', name: 'CP-1124' },
    { code: 'cp1125', name: 'CP-1125' },
    { code: 'cp1129', name: 'CP-1129' },
    { code: 'cp1133', name: 'CP-1133' },
    { code: 'cp1161', name: 'CP-1161' },
    { code: 'cp1162', name: 'CP-1162' },
    { code: 'cp1163', name: 'CP-1163' },
  ]),
  mac: createCodes([
    { code: 'maccroatian', name: 'MacCroatian' },
    { code: 'maccyrillic', name: 'MacCyrillic' },
    { code: 'macgreek', name: 'MacGreek' },
    { code: 'maciceland', name: 'MacIceland' },
    { code: 'macroman', name: 'MacRoman' },
    { code: 'macromania', name: 'MacRomania' },
    { code: 'macthai', name: 'MacThai' },
    { code: 'macturkish', name: 'MacTurkish' },
    { code: 'macukraine', name: 'MacUkraine' },
    { code: 'maccenteuro', name: 'MacCentEuro' },
    { code: 'macintosh', name: 'Macintosh' },
  ]),
  koi8: createCodes([
    { code: 'koi8-r', name: 'Koi8-r' },
    { code: 'koi8-u', name: 'Koi8-u' },
    { code: 'koi8-ru', name: 'Koi8-ru' },
    { code: 'koi8-t', name: 'Koi8-t' },
  ]),
  misc: createCodes([
    { code: 'armscii8', name: 'Armscii8' },
    { code: 'rk1048', name: 'Rk1048' },
    { code: 'tcvn', name: 'Tcvn' },
    { code: 'georgianacademy', name: 'Georgianacademy' },
    { code: 'georgianps', name: 'Georgianps' },
    { code: 'pt154', name: 'Pt154' },
    { code: 'viscii', name: 'Viscii' },
    { code: 'iso646cn', name: 'Iso646cn' },
    { code: 'iso646jp', name: 'Iso646jp' },
    { code: 'hproman8', name: 'Hproman8' },
    { code: 'tis620', name: 'Tis620' },
  ]),
  japanese: createCodes([
    { code: 'Shift_JIS', name: 'Shift-JIS' },
    { code: 'Windows-31j', name: 'Windows-31j' },
    { code: 'Windows932', name: 'Windows932' },
    { code: 'EUC-JP', name: 'EUC-JP' },
  ]),
  chinese: createCodes([
    { code: 'GB2312', name: 'GB2312' },
    { code: 'GBK', name: 'GBK' },
    { code: 'GB18030', name: 'GB18030' },
    { code: 'Windows936', name: 'Windows936' },
    { code: 'EUC-CN', name: 'EUC-CN' },
  ]),
  korean: createCodes([
    { code: 'KS_C_5601', name: 'KS-C-5601' },
    { code: 'Windows949', name: 'Windows949' },
    { code: 'EUC-KR', name: 'EUC-KR' },
  ]),
  taiwan: createCodes([
    { code: 'Big5', name: 'Big5' },
    { code: 'Big5-HKSCS', name: 'Big5-HKSCS' },
    { code: 'Windows950', name: 'Windows950' },
  ]),
} as const;

export type TTranslationCodes = (typeof ENCODES)[keyof typeof ENCODES][number]['code'];

export const translationSchema = z.object({
  code: z.enum(
    Object.values(ENCODES).flatMap((item) => item.map((item) => item.code)) as [
      string,
      ...string[],
    ],
  ),
  name: z.string(),
});

export type TTranslation = z.infer<typeof translationSchema>;
