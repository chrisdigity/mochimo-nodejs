
/* The features for the semantic grammar are
 * adapted from systemic grammar (Winograd, 1972). */

const F_ING = 1;
const F_INF = 2;
const F_MOTION = 4;
const F_NS = 8;
const F_NPL = 16;
// const F_N = (F_NS | F_NPL);
const F_MASS = 32;
const F_AMB = 64;
const F_TIMED = 128;
const F_TIMEY = 256;
// const F_TIME = (F_TIMED | F_TIMEY);
const F_AT = 512;
const F_ON = 1024;
const F_IN = 2048;
// const F_LOC = (F_AT | F_ON | F_IN);
// const F_NOUN = (F_NS | F_NPL | F_MASS | F_TIME | F_LOC);

const F_PREP = 4096;
const F_ADJ = 8192;
const F_OP = 16384;
// const F_DETS = 32768;
// const F_DETPL = 0x10000;
// const F_XLIT = 0x20000;

// const S_NL = (F_XLIT + 1);
// const S_CO = (F_XLIT + 2);
// const S_MD = (F_XLIT + 3);
// const S_LIKE = (F_XLIT + 4);
// const S_A = (F_XLIT + 5);
// const S_THE = (F_XLIT + 6);
// const S_OF = (F_XLIT + 7);
// const S_NO = (F_XLIT + 8);
// const S_S = (F_XLIT + 9);
// const S_AFTER = (F_XLIT + 10);
// const S_BEFORE = (F_XLIT + 11);

// const S_AT = (F_XLIT + 12);
// const S_IN = (F_XLIT + 13);
// const S_ON = (F_XLIT + 14);
// const S_UNDER = (F_XLIT + 15);
// const S_ABOVE = (F_XLIT + 16);
// const S_BELOW = (F_XLIT + 17);

// const MAXDICT = 256;
// const MAXH = 16;

/*
 * Case frames for the semantic grammar with a vibe inspired by Basho...

const Frame = [
  //  on a quiet moor
  //  raindrops
  //  fall
  [F_PREP, F_ADJ, F_MASS, S_NL, F_NPL, S_NL, F_INF | F_ING],
  [F_PREP, F_MASS, S_NL, F_ADJ, F_NPL, S_NL, F_INF | F_ING],
  [F_PREP, F_TIMED, S_NL, F_ADJ, F_NPL, S_NL, F_INF | F_ING],
  [F_PREP, F_TIMED, S_NL, S_A, F_NS, S_NL, F_ING],

  //  morning mist
  //  on a worn field--
  //  red
  [F_TIME, F_AMB, S_NL, F_PREP, S_A, F_ADJ, F_NS, S_MD, S_NL, F_ADJ | F_ING],
  [F_TIME, F_AMB, S_NL, F_ADJ, F_MASS, S_NL, F_ING],

  //  morning mist
  //  remains:
  //  smoke
  [F_TIME, F_MASS, S_NL, F_INF, S_S, S_CO, S_NL, F_AMB],

  //  arriving at a parched gate
  //  mist rises--
  //  a moonlit sandal

  //  pausing under a hot tomb
  //  firelight shining--
  //  a beautiful bon fire
  [F_ING, F_PREP, S_A, F_ADJ, F_NS, S_NL, F_MASS, F_ING, S_MD, S_NL, S_A,
    F_ADJ, F_NS],
  [F_ING, F_PREP, F_TIME, F_MASS, S_NL, F_MASS, F_ING, S_MD, S_NL, S_A, F_ADJ,
    F_NS],

  //  a wife
  //  in afternoon mist--
  //  sad
  [S_A, F_NS, S_NL, F_PREP, F_TIMED, F_MASS, S_MD, S_NL, F_ADJ]
]; */

const dict = [
  /* Adverbs and function words */
  ['NIL', 0],
  ['\n', F_OP],
  ['\b:', F_OP],
  ['\b--', F_OP],
  ['like', F_OP],
  ['a', F_OP],
  ['the', F_OP],
  ['of', F_OP],
  ['no', F_OP],
  ['\bs', F_OP],
  ['after', F_OP],
  ['before', F_OP],

  /* Prepositions */
  ['at', F_PREP],
  ['in', F_PREP],
  ['on', F_PREP],
  ['under', F_PREP],
  ['above', F_PREP],
  ['below', F_PREP],

  /* Verbs - intransitive ING and MOTION */
  ['arriving', F_ING | F_MOTION],
  ['departing', F_ING | F_MOTION],
  ['going', F_ING | F_MOTION],
  ['coming', F_ING | F_MOTION],
  ['creeping', F_ING | F_MOTION],
  ['dancing', F_ING | F_MOTION],
  ['riding', F_ING | F_MOTION],
  ['strutting', F_ING | F_MOTION],
  ['leaping', F_ING | F_MOTION],
  ['leaving', F_ING | F_MOTION],
  ['entering', F_ING | F_MOTION],
  ['drifting', F_ING | F_MOTION],
  ['returning', F_ING | F_MOTION],
  ['rising', F_ING | F_MOTION],
  ['falling', F_ING | F_MOTION],
  ['rushing', F_ING | F_MOTION],
  ['soaring', F_ING | F_MOTION],
  ['travelling', F_ING | F_MOTION],
  ['turning', F_ING | F_MOTION],
  ['singing', F_ING | F_MOTION],
  ['walking', F_ING | F_MOTION],
  /* Verbs - intransitive ING */
  ['crying', F_ING],
  ['weeping', F_ING],
  ['lingering', F_ING],
  ['pausing', F_ING],
  ['shining', F_ING],
  /* -------------- motion intransitive infinitive */
  ['fall', F_INF | F_MOTION],
  ['flow', F_INF | F_MOTION],
  ['wander', F_INF | F_MOTION],
  ['disappear', F_INF | F_MOTION],
  /* -------------- intransitive infinitive */
  ['wait', F_INF],
  ['bloom', F_INF],
  ['doze', F_INF],
  ['dream', F_INF],
  ['laugh', F_INF],
  ['meditate', F_INF],
  ['listen', F_INF],
  ['sing', F_INF],
  ['decay', F_INF],
  ['cling', F_INF],
  ['grow', F_INF],
  ['forget', F_INF],
  ['remain', F_INF],

  /* Adjectives - physical */
  /* valences (e) based on Osgood's evaluation factor */
  ['arid', F_ADJ],
  ['abandoned', F_ADJ],
  ['aged', F_ADJ],
  ['ancient', F_ADJ],
  ['full', F_ADJ],
  ['glorious', F_ADJ],
  ['good', F_ADJ],
  ['beautiful', F_ADJ],
  ['first', F_ADJ],
  ['last', F_ADJ],
  ['forsaken', F_ADJ],
  ['sad', F_ADJ],
  ['mandarin', F_ADJ],
  ['naked', F_ADJ],
  ['nameless', F_ADJ],
  ['old', F_ADJ],

  /* Ambient adjectives */
  ['quiet', F_ADJ | F_AMB],
  ['peaceful', F_ADJ],
  ['still', F_ADJ],
  ['tranquil', F_ADJ],
  ['bare', F_ADJ],

  /* Time interval adjectives or nouns */
  ['evening', F_ADJ | F_TIMED],
  ['morning', F_ADJ | F_TIMED],
  ['afternoon', F_ADJ | F_TIMED],
  ['spring', F_ADJ | F_TIMEY],
  ['summer', F_ADJ | F_TIMEY],
  ['autumn', F_ADJ | F_TIMEY],
  ['winter', F_ADJ | F_TIMEY],

  /* Adjectives - physical */
  ['broken', F_ADJ],
  ['thick', F_ADJ],
  ['thin', F_ADJ],
  ['little', F_ADJ],
  ['big', F_ADJ],
  /* Physical + ambient adjectives */
  ['parched', F_ADJ | F_AMB],
  ['withered', F_ADJ | F_AMB],
  ['worn', F_ADJ | F_AMB],
  /* Physical adj -- material things */
  ['soft', F_ADJ],
  ['bitter', F_ADJ],
  ['bright', F_ADJ],
  ['brilliant', F_ADJ],
  ['cold', F_ADJ],
  ['cool', F_ADJ],
  ['crimson', F_ADJ],
  ['dark', F_ADJ],
  ['frozen', F_ADJ],
  ['grey', F_ADJ],
  ['hard', F_ADJ],
  ['hot', F_ADJ],
  ['scarlet', F_ADJ],
  ['shallow', F_ADJ],
  ['sharp', F_ADJ],
  ['warm', F_ADJ],
  ['close', F_ADJ],
  ['calm', F_ADJ],
  ['cruel', F_ADJ],
  ['drowned', F_ADJ],
  ['dull', F_ADJ],
  ['dead', F_ADJ],
  ['sick', F_ADJ],
  ['deep', F_ADJ],
  ['fast', F_ADJ],
  ['fleeting', F_ADJ],
  ['fragrant', F_ADJ],
  ['fresh', F_ADJ],
  ['loud', F_ADJ],
  ['moonlit', F_ADJ | F_AMB],
  ['sacred', F_ADJ],
  ['slow', F_ADJ],

  /* Nouns top-level */
  /* Humans */
  ['traveller', F_NS],
  ['poet', F_NS],
  ['beggar', F_NS],
  ['monk', F_NS],
  ['warrior', F_NS],
  ['wife', F_NS],
  ['courtesan', F_NS],
  ['dancer', F_NS],
  ['daemon', F_NS],

  /* Animals */
  ['frog', F_NS],
  ['hawks', F_NPL],
  ['larks', F_NPL],
  ['cranes', F_NPL],
  ['crows', F_NPL],
  ['ducks', F_NPL],
  ['birds', F_NPL],
  ['skylark', F_NS],
  ['sparrows', F_NPL],
  ['minnows', F_NPL],
  ['snakes', F_NPL],
  ['dog', F_NS],
  ['monkeys', F_NPL],
  ['cats', F_NPL],
  ['cuckoos', F_NPL],
  ['mice', F_NPL],
  ['dragonfly', F_NS],
  ['butterfly', F_NS],
  ['firefly', F_NS],
  ['grasshopper', F_NS],
  ['mosquitos', F_NPL],

  /* Plants */
  ['trees', F_NPL | F_IN | F_AT],
  ['roses', F_NPL],
  ['cherries', F_NPL],
  ['flowers', F_NPL],
  ['lotuses', F_NPL],
  ['plums', F_NPL],
  ['poppies', F_NPL],
  ['violets', F_NPL],
  ['oaks', F_NPL | F_AT],
  ['pines', F_NPL | F_AT],
  ['chestnuts', F_NPL],
  ['clovers', F_NPL],
  ['leaves', F_NPL],
  ['petals', F_NPL],
  ['thorns', F_NPL],
  ['blossoms', F_NPL],
  ['vines', F_NPL],
  ['willows', F_NPL],

  /* Things */
  ['mountain', F_NS | F_AT | F_ON],
  ['moor', F_NS | F_AT | F_ON | F_IN],
  ['sea', F_NS | F_AT | F_ON | F_IN],
  ['shadow', F_NS | F_IN],
  ['skies', F_NPL | F_IN],
  ['moon', F_NS],
  ['star', F_NS],
  ['stone', F_NS],
  ['cloud', F_NS],
  ['bridge', F_NS | F_ON | F_AT],
  ['gate', F_NS | F_AT],
  ['temple', F_NS | F_IN | F_AT],
  ['hovel', F_NS | F_IN | F_AT],
  ['forest', F_NS | F_IN | F_AT],
  ['grave', F_NS | F_IN | F_AT | F_ON],
  ['stream', F_NS | F_IN | F_AT | F_ON],
  ['pond', F_NS | F_IN | F_AT | F_ON],
  ['island', F_NS | F_ON | F_AT],
  ['bell', F_NS],
  ['boat', F_NS | F_IN | F_ON],
  ['sailboat', F_NS | F_IN | F_ON],
  ['bon fire', F_NS | F_AT],
  ['straw mat', F_NS | F_ON],
  ['cup', F_NS | F_IN],
  ['nest', F_NS | F_IN],
  ['sun', F_NS | F_IN],
  ['village', F_NS | F_IN],
  ['tomb', F_NS | F_IN | F_AT],
  ['raindrop', F_NS | F_IN],
  ['wave', F_NS | F_IN],
  ['wind', F_NS | F_IN],
  ['tide', F_NS | F_IN | F_AT],
  ['fan', F_NS],
  ['hat', F_NS],
  ['sandal', F_NS],
  ['shroud', F_NS],
  ['pole', F_NS],

  /* Mass - substance */
  ['water', F_ON | F_IN | F_MASS | F_AMB],
  ['air', F_ON | F_IN | F_MASS | F_AMB],
  ['mud', F_ON | F_IN | F_MASS | F_AMB],
  ['rain', F_IN | F_MASS | F_AMB],
  ['thunder', F_IN | F_MASS | F_AMB],
  ['ice', F_ON | F_IN | F_MASS | F_AMB],
  ['snow', F_ON | F_IN | F_MASS | F_AMB],
  ['salt', F_ON | F_IN | F_MASS],
  ['hail', F_IN | F_MASS | F_AMB],
  ['mist', F_IN | F_MASS | F_AMB],
  ['dew', F_IN | F_MASS | F_AMB],
  ['foam', F_IN | F_MASS | F_AMB],
  ['frost', F_IN | F_MASS | F_AMB],
  ['smoke', F_IN | F_MASS | F_AMB],
  ['twilight', F_IN | F_AT | F_MASS | F_AMB],
  ['earth', F_ON | F_IN | F_MASS],
  ['grass', F_ON | F_IN | F_MASS],
  ['bamboo', F_MASS],
  ['gold', F_MASS],
  ['grain', F_MASS],
  ['rice', F_MASS],
  ['tea', F_IN | F_MASS],
  ['light', F_IN | F_MASS | F_AMB],
  ['darkness', F_IN | F_MASS | F_AMB],
  ['firelight', F_IN | F_MASS | F_AMB],
  ['sunlight', F_IN | F_MASS | F_AMB],
  ['sunshine', F_IN | F_MASS | F_AMB],

  /* Abstract nouns and acts */
  ['journey', F_NS | F_ON],
  ['serenity', F_MASS],
  ['dusk', F_TIMED],
  ['glow', F_NS],
  ['scent', F_NS],
  ['sound', F_NS],
  ['silence', F_NS],
  ['voice', F_NS],
  ['day', F_NS | F_TIMED],
  ['night', F_NS | F_TIMED],
  ['sunrise', F_NS | F_TIMED],
  ['sunset', F_NS | F_TIMED],
  ['midnight', F_NS | F_TIMED],
  ['equinox', F_NS | F_TIMEY],
  ['noon', F_NS | F_TIMED]
];

/**
 * @private
 * Emulate a PDP-10 running MACLISP (circa. 1971)...
 * <blockquote>a raindrop<br>on sunrise air--<br>drowned</blockquote>
 */
class Trigg {
  /**
   * Convert Mochimo block nonce as ArrayBuffer, buffer, to haiku string.
   * @param {external:Uint8Array|external:String} nonce
   * @return {external:String|null} Haiku expansion as String, or null if given
   * an invalid nonce parameter. */
  static expand (nonce, shadow = false) {
    // check for invalid nonce
    if ((typeof nonce === 'string' && nonce.length !== 64) ||
      (nonce.constructor.name === 'Uint8Array' && nonce.length !== 32) ||
      (typeof nonce !== 'string' && nonce.constructor.name !== 'Uint8Array')) {
      return null;
    }
    let offset = shadow ? 16 : 0;
    let result = '';
    for (const len = offset + 16; offset < len; offset++) {
      let dictIndex = '';
      if (typeof nonce === 'string') {
        const hexOffset = offset * 2;
        dictIndex = parseInt(`0x${nonce[hexOffset]}${nonce[hexOffset + 1]}`);
      } else {
        dictIndex = nonce[offset];
      }
      if (!dictIndex) break;
      result += dict[dictIndex][0];
      if (result.substr(-1) !== '\n') result += ' ';
    }
    // return resulting string expansion with backspace replacement
    return result.replace(/.\x08/g, ''); // eslint-disable-line no-control-regex
  }
}

module.exports = Trigg;
