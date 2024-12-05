import { z } from "zod";
import { generateMock } from "@anatine/zod-mock";

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number().max(200),
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;

export const createUser = (user: User) => {
  const result = userSchema.safeParse(user);

  if (!result.success) {
    console.error(result.error.message);
  }

  return result.data;
};

export const createMockUser = (seed?: number) =>
  generateMock(userSchema, { seed });
