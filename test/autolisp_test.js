const fs = require('fs');
const mocha = require('mocha');
const assert = require('assert');
const nativeFunctions = require('../nativeFunctions');
const alisp = require('../');

// Read external lsp file
const filePath = 'lsp/test.lsp';
// const filePath = 'lsp/real-autolisp.lsp';
const fileData = fs.readFileSync(filePath).toString();

const data = '(defun functionName()\n  (princ "\nfunctionName has been triggered!")\n)';

describe('AutoLISP. Split code in lines', function(){

  it('Simple new line', function(){
    assert.deepEqual(['This is a', 'test '],
      alisp.splitCodePerLine('This is a\ntest ')
    );
  });
  it('Double new line', function(){
    assert.deepEqual(['This', 'is a', 'test '],
      alisp.splitCodePerLine('This\nis a\n\ntest ')
    );
  });
  it('Spaces between lines', function(){
    assert.deepEqual(['This','is a', ' ', 'test '],
      alisp.splitCodePerLine('This\nis a\n \n\ntest ')
    );
  });
  it('Scape comments', function(){
    assert.deepEqual(['This','is a', ' ', 'test ', 'with "some\ndouble lines"'],
      alisp.splitCodePerLine('This\nis a\n \n\ntest \nwith "some\ndouble lines"')
    );
  });
  it('Last character is a single new line', function(){
    assert.deepEqual(['This','is a', ' ', 'test ', 'with "some\ndouble lines"'],
      alisp.splitCodePerLine('This\nis a\n \n\ntest \nwith "some\ndouble lines"\n')
    );
  });
  it('Last characters are various new lines', function(){
    assert.deepEqual(['This','is a', ' ', 'test ', 'with "some\ndouble lines"'],
      alisp.splitCodePerLine('This\nis a\n \n\ntest \nwith "some\ndouble lines"\n\n\n')
    );
  });
});

describe('AutoLISP. Get previous character:', function(){
  it('Normal', function(){
    assert.equal(alisp.getPrevChar('abcd', 1), 'a');
  });
  it('Current character is the first', function(){
    assert.equal(alisp.getPrevChar('abcd', 0), null);
  });
  it('Current character is the last', function(){
    assert.equal(alisp.getPrevChar('abcd', 3), 'c');
  });
  it('No previous character', function(){
    assert.equal(alisp.getPrevChar('abcd', 0), null);
  });
  it('Index out of range', function(){
    assert.equal(alisp.getPrevChar('abcd', 10), null);
  });
});

describe('AutoLISP. Get next character:', function(){
  it('Normal', function(){
    assert.equal(alisp.getNextChar('abcd', 1), 'c');
  });
  it('Current character is the first', function(){
    assert.equal(alisp.getNextChar('abcd', 0), 'b');
  });
  it('Current character is the last', function(){
    assert.equal(alisp.getNextChar('abcd', 3), null);
  });
  it('No next character', function(){
    assert.equal(alisp.getNextChar('abcd', 3), null);
  });
  it('Index out of range', function(){
    assert.equal(alisp.getNextChar('abcd', 10), null);
  });
});

describe('AutoLISP. Remove comments:', function(){
  it('Single line comment', function(){
    assert.equal('This is a test',
      alisp.removeComments('This is a test;; with ;a comment'));
  });
  it('Multiple line comments', function(){
    assert.equal('This is a test, with a seccond line',
      alisp.removeComments('This is a test; with a comment\n, with a seccond line; and a second comment'));
  });

  it('Single line comment', function(){
    assert.equal('This is a test , but not this',
      alisp.removeComments('This is a test ;|with a comment|;, but not this'));
  });
  it('Single inline comment. Comment with double quotes', function(){
    assert.equal('This is a test , but not this',
      alisp.removeComments('This is a test ;|with "a" comment|;, but not this'));
  });
  it('Single inline comment. Code and comment with double quotes', function(){
    assert.equal('This is "a" test , but not this',
      alisp.removeComments('This is "a" test ;|with "a" comment|;, but not this'));
  });
  it('Ringle multiline comment. Code and comment with double quotes', function(){
    assert.equal('This is "a" test ,\nbut not this',
      alisp.removeComments('This is "a" test ;|with "a" comment|;,\nbut not this'));
  });
  it('Multiple multiline comments. Code and comment with double quotes', function(){
    assert.equal('This is "a" test,\nbut not this',
      alisp.removeComments('This is ;|\nnot\n|;"a" test;|with "a" comment|;,\nbut not this'));
  });
});

describe('AutoLISP. Clean spaces, tabulations and new lines:', function() {
  // it('Double spaces + newlines + comment', function(){
  //   assert.equal(
  //     alisp.removeTabulationsAndNewLines("(defun DT:MyFunction ( ss / i )\n  ; Return selection set, if any\n  (setq ss (ssget))\n);END defun"),
  //     "(defun DT:MyFunction ( ss / i ) (setq ss (ssget)))"
  //   );
  // });
  // it('Tabulation + newlines + comment', function(){
  //   assert.equal(
  //     alisp.removeTabulationsAndNewLines("(defun DT:MyFunction ( ss / i )\n\t; Return selection set, if any\n\t(setq ss (ssget))\n);END defun"),
  //     "(defun DT:MyFunction ( ss / i ) (setq ss (ssget)))"
  //   );
  // });
});

// describe('AutoLISP. Split code in chunks:', function() {
//   it.skip('Split in chunks', function(){
//     assert(alisp.splitInChunks(data) === ['defun', 'functionName()', 'princ', '"\nfunctionName has been triggered!"']);
//   });
// });

describe('AutoLISP. Clean, parse and get dependencies', function() {
  it('Untitled', function() {
    // console.log(`fileData:\n${fileData}\n`);
    assert.equal(
      alisp.parseLisp(fileData),
      "."
    );
  });
});