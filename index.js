const nativeFunctions = require('./nativeFunctions');

/**
 * Split string in lines, escapes anything between double quotes
 * @argument {string} s - Multiline (\n) source code
 * @returns {Array} - Array with source code split in lines
 */
const splitCodePerLine = s => {
  let escapeChar = false;
  let curChar;
  let stringLine = '';
  let pushNewLine = false;
  const stringLineArray = [];

  for (let i = 0; i < s.length; i++) {
    curChar = s[i];
    process.stdout.write((curChar === '\n' ? '\\n' : curChar) + '\t');
    
    if (curChar === '"') {
      escapeChar = !escapeChar;
    }
    
    if (curChar === '\n' && !escapeChar) {
      pushNewLine = true;
    }
    process.stdout.write('pushLine: ' + (pushNewLine ? 'T' : '-') + '\t');
    
    // Add current character (curChar) to buffer (stringLine) if it proceeds
    // proceedes when:
    //   + current character is not escaped (escapeChar false)
    //   + current character is not \n (pushNewLIen false)
    // if ( !escapeChar && !pushNewLine ) {
    if ( !escapeChar && !pushNewLine ) {
      stringLine += curChar;
    }
    process.stdout.write('esc: ' + (escapeChar ? 'T' : '-') + '\t');
    process.stdout.write('buffer: ' + JSON.stringify(stringLine) + '\t');
    
    // push buffered string to stringLineArray after \n or when last char reached,
    // if any buffer is available
    if ((pushNewLine || i === s.length - 1) && stringLine.length > 0) {
      stringLineArray.push(stringLine);
      pushNewLine = false;
      stringLine = '';
    } else if (pushNewLine) {
      pushNewLine = false;
    }

    console.log('out:', stringLineArray);

  }

  return stringLineArray;
}

/**
 * Remove inline comments in the source code line
 * @argument {string} s - Source code line with comment(s)
 * @return {string} - Clean source code line
 */
const removeInlineComments = s => {
  let curChar;
  let 

  // const nonInlineCommentRegEx = new RegExp('([^;\|]*);\|[^;\|]*\|;');
  // const nonInlineComment = nonInlineCommentRegEx.exec(s);
  // console.log('nonInlineComment:', nonInlineComment);
  // return result;
  
  // const inlineCommentStart = s.search(/;\|/);
  // const inlineCommentEnd   = s.search(/\|;/);
  // const result = s.split('')
  //   .filter((x,i) => {
  //     return (i < inlineCommentStart || i > inlineCommentEnd +1);
  //   })
  //   .join('')
  // ;
  // return result;
};

/**
 * Remove comments in the source code line
 * @argument {string} s - Source code line with comment(s)
 * @return {string} - Clean source code line
 */
const removeLineComments = s => {
  let curChar;
  let prevChar;
  let isComment = false;
  let isInlineComment = false;
  let buffer = '';
  for(let i = 0; i < s.length; i++) {
    curChar = s[i];
    i > 0 ? prevChar = s[i-0] : null;

    if (curChar === ';' && !isComment && !isInlineComment) {
      isComment = true;
    } else if (isComment && curChar === '|' && prevChar === ';') {
      isInlineComment = true;
    } else if (isComment && curChar === ';' && prevChar === '|') {
      isComment = false;
    }
    
    isComment ? null : buffer += curChar

    // console.log('Chararacter ' + i + ': ' + currentChar, '\tisComment:', isComment, '\tbuffer:', buffer);
  }

  return buffer;
}

/**
 * Remove all AutoLISP code
 * @argument {string} s - Source code with comments
 * @return {string} - Clean source code
 */
const removeComments = s => {
  return s
    .split('\n')
    .map(line => {
      console.log(line);
      return line;
    })
    .map(lineWithComments => removeLineComments(lineWithComments))
  ;
}

/**
 * Split AutoLISP code in chunks
 * @argument {string} s - String to split in chunks
 * @return {Array} - Array with chunks
 */
const splitInChunks = s => {
  const functionDefinitionReg = /\(defun/;
  
  return ['chunk1', 'chunk2' ];
}

/**
 * Read an AutoLISP string and returns its the depdencies
 * @argument {string} autolispString - AutoLISP string to be parsed
 * @returns {object} - Object with dependencies
 */
const parseLisp = autolispString => {
  console.log('data', autolispString);
  // splitInChunks('testString');
  removeComments('testString');
  // remove comments
  // remove spaces and new lines
  // split the string per 1st level functions
  //    if defun, look for dependencies at any level, but ignore how deep is it
  //    if function call, don't look for dependencies
};

module.exports = {
  splitCodePerLine,
  removeInlineComments,
  removeLineComments,
  removeComments,
  splitInChunks,
  parseLisp
};