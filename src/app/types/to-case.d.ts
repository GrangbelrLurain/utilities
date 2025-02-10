declare module 'to-case' {
  interface ToCase {
    (str: string): string;

    snake(str: string): string;
    camel(str: string): string;
    kebab(str: string): string;
    pascal(str: string): string;
    capital(str: string): string;
    constant(str: string): string;
    dot(str: string): string;
    inverse(str: string): string;
    lower(str: string): string;
    sentence(str: string): string;
    slug(str: string): string;
    space(str: string): string;
    title(str: string): string;
    upper(str: string): string;
  }

  const to: ToCase;
  export default to;
}
