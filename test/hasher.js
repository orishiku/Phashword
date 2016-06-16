const hasher = require('../src/hasher');
const assert = require('chai').assert;

describe('hasher', function() {
  it('should has basic hasing capabilities', function() {
    let hash = hasher.hashPassword(
      "test",       // site tag
      "master",     // master key
      "private",    // private key
      12,           // Password length
      1             // alphanumeric + special chars
    );
    assert.isOk(hash, 'A hash is produced');
  });
  it('should be compatible with twik-for-chrome', function() {
    // Numeric password
    let password = hasher.hashPassword(
      "test",       // site tag
      "master",     // master key
      "private",    // private key
      8,            // Password length
      3             // numeric
    );
    let twik = "88105589";  // Password hashed with twik
    assert.equal(password, twik, "Numeric password seem compatible with Twik");

    // Alphanumeric password
    password = hasher.hashPassword(
      "test",       // site tag
      "master",     // master key
      "private",    // private key
      8,            // Password length
      2             // Alphanumeric
    );
    twik = "LL1b5Bjk";  // Password hashed with twik
    assert.equal(password, twik, "Alphanumeric password seem compatible with Twik");

    // Alphanumeric + special characters password
    password = hasher.hashPassword(
      "test",       // site tag
      "master",     // master key
      "private",    // private key
      8,            // Password length
      1             // Alphanumeric + special chars
    );
    twik = "LL1!5Bjk";  // Password hashed with twik
    assert.equal(password, twik, "Special chars password seem compatible with Twik");
  });
  it('should be compatible with twik and special chars', function() {
    let password = hasher.hashPassword(
      "test",
      "Ümlaut",
      "private",
      12,
      1
    );
    let twik = "kphic2eR4/*F";
    assert.equal(password, twik, "Compatible with umlauts in master key");

    password = hasher.hashPassword(
      "test",
      "€uro",
      "private",
      12,
      1
    );
    twik = "gxK1KMGF7is+";
    assert.equal(password, twik, "Compatible with euro symbol in master key");

    password = hasher.hashPassword(
      "test",
      "äî$Üœ",
      "private",
      12,
      1
    );
    twik = "tck5-E8vrrel";
    assert.equal(password, twik, "Compatible with several special chars in master key");

    password = hasher.hashPassword(
      "Ümlaut",
      "master",
      "private",
      12,
      1
    );
    twik = "XPGfT!MmWc2X";
    assert.equal(password, twik, "Compatible with several special chars in tag");

    password = hasher.hashPassword(
      "test",
      "Üœlzk",
      "Üœlzk",
      12,
      1
    );
    twik = "B766HlSaS/Gq";
    assert.equal(password, twik, "Compatible with several special chars in master and private key");
  });
});