const mocha = require('mocha');
const assert = require('assert');
const nativeFunctions = require('../nativeFunctions');
const alisp = require('../');

// const filePath = 'lsp/test.lsp';

const data = '(defun functionName()\n  (princ "\nfunctionName has been triggered!")\n)';

const test = describe('AutoLISP parser tests', function(){

  it('Split code in lines. Simple new line', function(){
    assert.deepEqual(['This is a', 'test '], alisp.splitCodePerLine('This is a\ntest '));
  });
  it('Split code in lines. Double new line', function(){
    assert.deepEqual(['This', 'is a', 'test '], alisp.splitCodePerLine('This\nis a\n\ntest '));
  });
  it('Split code in lines. Spaces between lines', function(){
    assert.deepEqual(['This','is a', ' ', 'test '], alisp.splitCodePerLine('This\nis a\n \n\ntest '));
  });
  it('Split code in lines. Scape comments', function(){
    assert.deepEqual(['This','is a', ' ', 'test ', 'with "some\ndouble lines"'], alisp.splitCodePerLine('This\nis a\n \n\ntest \nwith "some\ndouble lines"'));
  });
  it.skip('Remove normal comment', function(){
    assert('This is a test ' === alisp.removeLineComments('This is a test ;;with a comment'));
  });
  it.skip('Remove single inline comment', function(){
    assert('This is a test , but not this' === alisp.removeInlineComments('This is a test ;|with a comment|;, but not this'));
  });
  it.skip('Remove multiple inline comments', function(){
    assert('This is great!' === alisp.removeInlineComments('This is ;|not|;great;|at all|;!'));
  });
  it.skip('Split in chunks', function(){
    assert(alisp.splitInChunks(data) === ['defun', 'functionName()', 'princ', '"\nfunctionName has been triggered!"']);
  });
});1