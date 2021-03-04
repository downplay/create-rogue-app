declare const lexer: any;
export { lexer as Lexer };
export declare const ParserRules: (
  | {
      name: string;
      symbols: any[];
      postprocess: (d: any) => any;
    }
  | {
      name: string;
      symbols: (
        | string
        | {
            match: RegExp;
            lineBreaks: boolean;
          }
        | {
            type: string;
          }
      )[];
      postprocess?: undefined;
    }
)[];
export declare const ParserStart: string;
