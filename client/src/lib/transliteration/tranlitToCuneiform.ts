// @ts-ignore
import { translit_to_unicode } from "@/lib/transliteration/textnorm.js"
// @ts-ignore
import { map_one_chunk, normed_unicode_to_cuneiform_lines } from "@/lib/transliteration/cuneify_lib.js"

export function translitToCuneiform(transliteratedAkkadain: string) {
    let transliteratedASCII = transliteratedAkkadain
    console.log(transliteratedASCII)
    let normalised: string = translit_to_unicode(transliteratedASCII).replace(/#/g, "")
    console.log(normalised)
    // [1] gives number of occurances of each symbol, [0] gives text
    let cuneiformUnicode = normed_unicode_to_cuneiform_lines(normalised)[0]
    
    return cuneiformUnicode;
}