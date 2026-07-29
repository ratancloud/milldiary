export interface VillageEntry {
    en: string;
    hi: string;
    aliases: string[];
}

export const MASTER_VILLAGES: VillageEntry[] = [
    { en: 'Agiaon Bazar', hi: 'अगिऑँव बाजार', aliases: ['अ०', 'आ०', 'आ० बाजार', 'अगिआँव', 'अगिआँव बाजार'] },
    { en: 'Chhawani', hi: 'छवनी', aliases: ['चौ०', 'छ०', 'चौ०छ०', 'चौ० छवनी', 'छावनी'] },
    { en: 'Amehta', hi: 'अमेहता', aliases: ['अमेहत'] },
    { en: 'Nadhi', hi: 'नाढ़ी', aliases: ['नाड़ी', 'नाधी', 'ना०'] },
    { en: 'Dhanpura', hi: 'धनपुरा', aliases: ['धनपूरा', 'ध०'] },
    { en: 'Pitro', hi: 'पिटरो', aliases: ['पीटरो', 'पि०'] },
    { en: 'Jogradih', hi: 'जोगराडिह', aliases: ['जोगरा डिह', 'जो०', 'Jo.'] },
    { en: 'Salakhna', hi: 'सलाखना', aliases: ['सलखना', 'स०'] },
    { en: 'Baghaur Narayanpur', hi: 'बघउड़ नारायणपुर', aliases: ['ब०', 'न०', 'बघउड़', 'नारायणपुर', 'बघउर', 'बघउर नारायणपुर'] },
    { en: 'Hathdihan', hi: 'हथडिहाँ', aliases: ['ह०', 'हथ०'] },
    { en: 'Anua', hi: 'अनुआ', aliases: ['अनुवा', 'अ०नु०'] },
    { en: 'Tiwari Dih', hi: 'तिवारी डिह', aliases: ['ति०', 'तिवारीडिह', 'तिवारी'] },
    { en: 'Parmanpur', hi: 'प्रमाण पुर', aliases: ['परमानपुर', 'प्रमाणपुर', 'प०', 'Parman Pur'] },
    { en: 'Pachfhedwa', hi: 'पांचफ़ेडवा', aliases: ['पांचफेडवा', 'पाँचफेडवा', 'पां०'] },
    { en: 'Dehri Tola', hi: 'डिहरी टोला', aliases: ['डिहरीटोला', 'डी०'] },
    { en: 'Latthan', hi: 'लट्ठान', aliases: ['लठान', 'ल०'] },
    { en: 'Pipra Dih', hi: 'पिपरा डिह', aliases: ['पिपराडिह', 'पि०डि०'] },
    { en: 'Koath', hi: 'कोआथ', aliases: ['को०', 'कोअथ'] },
    { en: 'Kothuwa', hi: 'कोठुआ', aliases: ['कोबुऑँ', 'कोठुवा', 'कोठु०'] },
    { en: 'Baroda Tola', hi: 'बड़ौडा टोला', aliases: ['बड़ौदा टोला', 'बड़ौडा', 'ब०टो०'] },
    { en: 'Gogsar', hi: 'गोगसड़', aliases: ['गोगसर', 'गो०'] },
    { en: 'Moti Dih', hi: 'मोति डिह', aliases: ['मोतीडिह', 'मोती डिह', 'मो०'] },
    { en: 'Telar', hi: 'तेलाड़', aliases: ['तेलाड', 'ते०'] },
    { en: 'Prema Rai Ke Tola', hi: 'प्रेमा राय के टोला', aliases: ['प्रेमा राय', 'प्रेमा राय टोला', 'प्रे०'] },
    { en: 'Chimni Par', hi: 'चिमनी पर', aliases: ['चिमनीपर', 'चि०'] },
    { en: 'Ganpat Tola', hi: 'गणपत टोला', aliases: ['गणपतटोला', 'ग०टो०'] },
];

// Pre-build O(1) Lookup Maps
const enLookup = new Map<string, VillageEntry>();
const hiLookup = new Map<string, VillageEntry>();
const aliasLookup = new Map<string, VillageEntry>();

for (const v of MASTER_VILLAGES) {
    enLookup.set(v.en.toLowerCase(), v);
    hiLookup.set(v.hi, v);
    for (const a of v.aliases) {
        const cleanAlias = a.toLowerCase().trim();
        aliasLookup.set(cleanAlias, v);
        aliasLookup.set(cleanAlias.replace(/[०.]/g, ''), v);
    }
}

function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return dp[m][n];
}

// ─── Resolve a raw village string to the best master match ───────────────────
// Priority: exact en match → exact hi match → exact alias match → fuzzy match → raw fallback
export function resolveVillage(rawEn: string, rawHi: string): { en: string; hi: string; matched: boolean } {
    const normEn = rawEn.trim().toLowerCase();
    const normHi = rawHi.trim();

    // 1. Exact English name match
    if (enLookup.has(normEn)) {
        const v = enLookup.get(normEn)!;
        return { en: v.en, hi: v.hi, matched: true };
    }

    // 2. Exact Hindi name match
    if (hiLookup.has(normHi)) {
        const v = hiLookup.get(normHi)!;
        return { en: v.en, hi: v.hi, matched: true };
    }

    // 3. Alias match (English input)
    if (aliasLookup.has(normEn)) {
        const v = aliasLookup.get(normEn)!;
        return { en: v.en, hi: v.hi, matched: true };
    }

    // 4. Alias match (Hindi input)
    if (aliasLookup.has(normHi)) {
        const v = aliasLookup.get(normHi)!;
        return { en: v.en, hi: v.hi, matched: true };
    }

    // 5. Alias match without dots/periods (Hindi abbreviated forms)
    const normHiNoDots = normHi.replace(/[०.]/g, '').trim();
    if (normHiNoDots && aliasLookup.has(normHiNoDots)) {
        const v = aliasLookup.get(normHiNoDots)!;
        return { en: v.en, hi: v.hi, matched: true };
    }

    // 6. Fuzzy match — find the closest English name by Levenshtein distance
    //    Only accept if distance <= 40% of the master name length (tight threshold)
    let bestMatch: (typeof MASTER_VILLAGES)[number] | null = null;
    let bestDist = Infinity;

    for (const v of MASTER_VILLAGES) {
        const dist = levenshtein(normEn, v.en.toLowerCase());
        if (dist < bestDist) {
            bestDist = dist;
            bestMatch = v;
        }
        // Also check against aliases
        for (const a of v.aliases) {
            const aDist = levenshtein(normEn, a.toLowerCase());
            if (aDist < bestDist) {
                bestDist = aDist;
                bestMatch = v;
            }
        }
    }

    // Also fuzzy-match on Hindi
    for (const v of MASTER_VILLAGES) {
        const dist = levenshtein(normHi, v.hi);
        if (dist < bestDist) {
            bestDist = dist;
            bestMatch = v;
        }
    }

    if (bestMatch) {
        const maxLen = Math.max(bestMatch.en.length, normEn.length, normHi.length, 1);
        const similarity = 1 - bestDist / maxLen;
        if (similarity >= 0.55) {
            return { en: bestMatch.en, hi: bestMatch.hi, matched: true };
        }
    }

    // 7. No match — return raw values (LLM prediction as-is)
    return { en: rawEn || 'Unknown', hi: rawHi || 'अज्ञात', matched: false };
}

export const VILLAGE_REFERENCE = MASTER_VILLAGES.map(
    (v) => `• "${v.en}" = "${v.hi}"${v.aliases.length > 0 ? ` [shortcuts: ${v.aliases.join(', ')}]` : ''}`
).join('\n');