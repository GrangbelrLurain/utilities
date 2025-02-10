import { z } from 'zod';
import { ENCODES } from '@Entities/encode/constants/translation';

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
