function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, char => {
      const map = { 'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo',
        'ж':'zh','з':'z','и':'i','й':'j','к':'k','л':'l','м':'m','н':'n',
        'о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh',
        'ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'',
        'э':'e','ю':'yu','я':'ya' };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function cleanName(name) {
  return (name || '')
    .replace(/\s*[-\u2013\u2014:]\s*(PS[45]|PlayStation\s*[45])\s*(Edition|Version)?/gi, '')
    .replace(/\s*\((PS[45]|PlayStation)\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

module.exports = { slugify, cleanName };
