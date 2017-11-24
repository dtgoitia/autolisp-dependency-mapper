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
    
    if (curChar === '"') {
      escapeChar = !escapeChar;
      stringLine += curChar;          // add current character to bufer
    } else if (curChar === '\n') {
      if (escapeChar) {
        stringLine += curChar;        // add current character to bufer
      } else {
        if (stringLine.length > 0) {  // add new line
          stringLineArray.push(stringLine);
          stringLine = '';
        }
      }
    } else {
      stringLine += curChar;
    }
    // If it's the last character and proceeds add new line
    if (i === s.length - 1 && stringLine.length > 0) {
      stringLineArray.push(stringLine);
    }
  }

  return stringLineArray;
}

/**
 * Get previous character in the string, if exists, otherwise null
 * @argument {string} s - String
 * @argument {string} i - Current character index (previous character -> i -1)
 * @return Previous character if any, otherwise null
 */
const getPrevChar = (s, i) => {
  return (i > 0 && i < s.length)
    ? s[i-1]
    : null
  ;
};

/**
 * Remove inline comments in the source code line
 * @argument {string} s - Source code line with comment(s)
 * @return {string} - Clean source code line
 */
const removeInlineComments = s => {
  let curChar;
  let returnString = '';
  let isString = false;
  let isComment = false;
  let isInlineComment = false;
  for (let i = 0; i < s.length ; i++) {
    curChar = s[i];
    process.stdout.write(curChar);
    if (curChar === '"') {
      process.stdout.write('  1')
      !isString ? isString = !isString : null;
      returnString += curChar;
    } else {
      process.stdout.write('  2')
      if (isString) {
        process.stdout.write('  3')
        returnString += curChar;
      } else if (curChar === ';') {
        process.stdout.write('  4')
        if (isComment) {
          // process.stdout.write('  5')
          if (isInlineComment) {
            // process.stdout.write('  6')
            if (getPrevChar(s, i) === '|') {
              process.stdout.write('  7')
              isInlineComment = false;
              isComment = false;
            }
          }
        } else {
          process.stdout.write('  8')
          isComment = true;
        }
      } else if ( curChar === '|') {
        process.stdout.write('  9')
        if (isInlineComment) {
          process.stdout.write('  10')
          null;
        } else {
          process.stdout.write('  11')
          if ( getPrevChar (s, i) === ';') {
            process.stdout.write('  12')
            isInlineComment = true;
          }
        }
      } else {
        process.stdout.write('  13')
        if (isComment) {
          null;
        } else {
          returnString += curChar;
        }
      }
    }
    process.stdout.write('\tisComment: ' + (isComment ? 'T' : '-'));
    process.stdout.write('\tisInlineComment: ' + (isInlineComment ? 'T' : '-'));
    process.stdout.write('\treturnString: ' + returnString + '\n');

  }

  return returnString;
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
  getPrevChar,
  splitCodePerLine,
  removeInlineComments,
  removeLineComments,
  removeComments,
  splitInChunks,
  parseLisp
};