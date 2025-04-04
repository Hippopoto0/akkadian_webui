// @ts-ignore
import { translit_to_unicode } from "@/lib/transliteration/textnorm.js"
// @ts-ignore
import { map_one_chunk, normed_unicode_to_cuneiform_lines } from "@/lib/transliteration/cuneify_lib.js"

/**
 * 
 * @param transliteratedAkkadian ascii akkadian string to translate -eg (_mul2_-ar2)-sza2-_sag_-_hun 1 1_/2 _kusz3_ sin 4 _kusz3_ ana _ulu3 sig_ e  
 * @returns unicode representation with cuneiform characters, e.g. - 𒀀 𒈾 𒋀 𒈬 𒄿 𒇻 𒈨 𒈨 𒈨 𒌑 𒈾 𒄠 𒁀 𒄿 𒇻 𒈨 𒈨 𒈨 𒄿 𒇻 𒆕 𒁉 𒈨 𒈨 𒈨
 */
export function translitToCuneiform(transliteratedAkkadian: string | undefined): string {
    // dont process if empty
    if (transliteratedAkkadian === undefined) return ""
    let transliteratedASCII = transliteratedAkkadian
    // put into unicode format so sz -> s with circumflex etc
    let normalised: string = translit_to_unicode(transliteratedASCII)
    // replaces # and " x " characters, neither of which is handled by conversion script
    let cleaned = normalised.replace(/#/g, "").replace(" x ", "")
    // [1] gives number of occurances of each symbol, [0] gives text
    let cuneiformUnicode = normed_unicode_to_cuneiform_lines(cleaned)[0][0]
    let addedBreaks = cuneiformUnicode.replace(/░+/g, "[...]")
    return addedBreaks;
}