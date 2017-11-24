const mocha = require('mocha');
const assert = require('assert');
const nativeFunctions = require('../nativeFunctions');
const alisp = require('../');

// const filePath = 'lsp/test.lsp';

const data = '(defun functionName()\n  (princ "\nfunctionName has been triggered!")\n)';

const test = describe('AutoLISP parser tests', function(){

  it('Split code in lines. Simple new line', function(){
    assert.deepEqual(
      ['This is a', 'test '],
      alisp.splitCodePerLine('This is a\ntest ')
    );
  });
  it('Split code in lines. Double new line', function(){
    assert.deepEqual(
      ['This', 'is a', 'test '],
      alisp.splitCodePerLine('This\nis a\n\ntest ')
    );
  });
  it('Split code in lines. Spaces between lines', function(){
    assert.deepEqual(
      ['This','is a', ' ', 'test '],
      alisp.splitCodePerLine('This\nis a\n \n\ntest ')
    );
  });
  it('Split code in lines. Scape comments', function(){
    assert.deepEqual(
      ['This','is a', ' ', 'test ', 'with "some\ndouble lines"'],
      alisp.splitCodePerLine('This\nis a\n \n\ntest \nwith "some\ndouble lines"')
    );
  });
  it('Split code in lines. Last character is a single new line', function(){
    assert.deepEqual(
      ['This','is a', ' ', 'test ', 'with "some\ndouble lines"'],
      alisp.splitCodePerLine('This\nis a\n \n\ntest \nwith "some\ndouble lines"\n')
    );
  });
  it('Split code in lines. Last characters are various new lines', function(){
    assert.deepEqual(
      ['This','is a', ' ', 'test ', 'with "some\ndouble lines"'],
      alisp.splitCodePerLine('This\nis a\n \n\ntest \nwith "some\ndouble lines"\n\n\n')
    );
  });


  it('Get previous char. Case: normal', function(){
    assert('a' === alisp.getPrevChar('abcd', 1));
  });
  it('Get previous char. Case: current character is the last', function(){
    assert('c' === alisp.getPrevChar('abcd', 3));
  });
  it('Get previous char. Case: no previous character', function(){
    assert(null === alisp.getPrevChar('abcd', 0));
  });
  it('Get previous char. Case: index out of range', function(){
    assert(null === alisp.getPrevChar('abcd', 10));
  });


  it('Remove single inline comment', function(){
    assert.equal(
      'This is a test , but not this',
      alisp.removeInlineComments('This is a test ;|with a comment|;, but not this')
    );
  });
  it.skip('Remove single inline comment. Comment with double quotes', function(){
    assert('This is a test , but not this' === alisp.removeInlineComments('This is a test ;|with "a" comment|;, but not this'));
  });
  it.skip('Remove single inline comment. Code and comment with double quotes', function(){
    assert('This is "a" test , but not this' === alisp.removeInlineComments('This is "a" test ;|with "a" comment|;, but not this'));
  });
  it.skip('Remove normal comment', function(){
    assert('This is a test ' === alisp.removeLineComments('This is a test ;;with a comment'));
  });
  it.skip('Remove multiple inline comments', function(){
    assert('This is great!' === alisp.removeInlineComments('This is ;|not|;great;|at all|;!'));
  });
  it.skip('Split in chunks', function(){
    assert(alisp.splitInChunks(data) === ['defun', 'functionName()', 'princ', '"\nfunctionName has been triggered!"']);
  });
});






