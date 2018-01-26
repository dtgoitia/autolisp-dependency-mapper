const elparser = require('elparser');
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
 * @argument {string} i - Current character index (previous character -> i - 1)
 * @return Previous character if any, otherwise null
 */
const getPrevChar = (s, i) => {
  return (i > 0 && i < s.length)
    ? s[i-1]
    : null
  ;
};

/**
 * Get next character in the string, if exists, otherwise null
 * @argument {string} s - String
 * @argument {string} i - Current character index (next character -> i + 1)
 * @return Next character if any, otherwise null
 */
const getNextChar = (s, i) => {
  return (i >= 0 && i < s.length)
    ? s[i+1]
    : null
  ;
};

/**
 * Remove inline comments in the source code line
 * @argument {string} s - Source code line with comment(s)
 * @return {string} - Clean source code line
 */
const removeComments = s => {
  let curChar;
  let returnString = '';
  let isQuotedString = false;
  let isComment      = false;
  let isBlockComment = false;

  for (let i = 0; i < s.length ; i++) {
    curChar = s[i];
    
    if(isQuotedString) {
      if (curChar === '"') {
        if (getPrevChar(s, i) === '\\') {
          returnString += curChar;
        } else {
          isQuotedString = false;
          returnString += curChar;
        }
      } else {
        returnString += curChar;
      }
    } else {
      if (isComment) {
        if (isBlockComment) {
          if (curChar === ';') {
            if (getPrevChar(s, i) === '|') {
              isComment = false;
              isBlockComment = false;
            }
          }
        } else {
          if (curChar === '\n') {
            isComment = false;
          } else {
            if (curChar === '|') {
              if (getPrevChar(s, i) === ';') {
                isBlockComment = true;
              }
            }
          }
        }
      } else {
        if (curChar === '"') {
          isQuotedString = true;
          returnString += curChar;
        } else {
          if (curChar === ';') {
            isComment = true;
          } else {
            returnString += curChar;
          }
        }
      }
    }
  }
  return returnString;
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
 * Split AutoLISP code in chunks
 * @argument {string} s - String to split in chunks
 * @return {Array} - Array with chunks
 */
const splitInChunks = s => {
  const functionDefinitionReg = /\(defun/;
  
  return ['chunk1', 'chunk2' ];
}

/**
 * Remove double spaces, tabulations and newlines
 * @argument {string} s - String to be cleaned
 * @returns {string} - Clean string
 */
const removeTabulationsAndNewLines = s => {
  let curChar;
  let isQuotedString = false;
  let returnString = '';
  for (let i = 0; i < s.length; i++) {
    curChar = s[i];
    
    if (isQuotedString) {
      if (curChar === '"' && getPrevChar(s, i-1) !== '\\' ) {
        isQuotedString = !isQuotedString;
      }
      returnString += curChar;
    } else {
      if (curChar === '"') {
        isQuotedString = !isQuotedString;
        returnString += curChar;
      } else if (curChar !== '\n' && curChar !== '\r' && curChar !== '\t') {
        returnString += curChar;
      }
    }
  }

  return returnString;
}

/**
 * Remove double spaces, except the ones between double quotes
 * @argument {string} s - AutoLISP string to be parsed
 * @returns {string} - AutoLISP string with no double spaces
 */
const removeDoubleSpaces = s => {
  let curChar;
  let isQuotedString = false;
  let returnString = '';
  for (let i = 0; i < s.length; i++) {
    curChar = s[i];
    
    if (isQuotedString) {
      if (curChar === '"' && getPrevChar(s, i) !== '\\' ) {
        isQuotedString = !isQuotedString;
      }
      returnString += curChar;
    } else {
      if (curChar === '"') {
        isQuotedString = !isQuotedString;
        returnString += curChar;
      } else if (curChar === ' ' && getPrevChar(s, i) === ' ') {
          null;
      } else {
        returnString += curChar;
      } 
    }
  }

  return returnString;
}

/**
 * Add a space before argument and variable declaration parenthesis
 * @argument {string} s - AutoLISP string to be parsed
 * @returns {string} - AutoLISP string with a space
 */
const addSpaceBeforeArgsAndVars = s => {
  let curChar;
  let isQuotedString = false;
  let returnString = '';
  for (let i = 0; i < s.length; i++) {
    curChar = s[i];
    
    if (isQuotedString) {
      if (curChar === '"' && getPrevChar(s, i) !== '\\' ) {
        isQuotedString = !isQuotedString;
      }
      returnString += curChar;
    } else {
      if (curChar === '"') {
        isQuotedString = !isQuotedString;
        returnString += curChar;
      } else if (curChar === '(' && getPrevChar(s, i) !== ' ' && i !== 0) {
          returnString += ' ' + curChar;
      } else {
        returnString += curChar;
      } 
    }
  }

  return returnString;
}

/**
 * Get the dependencies of all the SExp objects in the array
 * @argument {Array} sexpArray - Array of SExp objects
 * @returns {Array} - Array with dependencies
 */
const getDependencies = sexpArray => {
  return sexpArray.map(sexp => {
    if (sexp.hasOwnProperty('list')) {
      const functionSymbol = sexp.list[0].symbol;
      if (functionSymbol === 'defun') {
        const defunName = sexp.list[1].symbol;
        return [functionSymbol, defunName];
      } else {
        return functionSymbol
      }
    } else {
      return null;
    }
  });
}

/**
 * Read an AutoLISP string and returns its the dependencies
 * @argument {string} s - AutoLISP string to be parsed
 * @returns {object} - Object with dependencies
 */
const removeDuplicatedDependencies = dependencyArray => {
  
  return dependencyArray;
}

/**
 * Read an AutoLISP string and returns its the dependencies
 * @argument {string} s - AutoLISP string to be parsed
 * @returns {object} - Object with dependencies
 */
const parseLisp = s => {
  const noComments = removeComments(s);
  const noTabsNewlines = removeTabulationsAndNewLines(noComments);
  const noDoubleSpaces = removeDoubleSpaces(noTabsNewlines);
  const spacesBeforeVariables = addSpaceBeforeArgsAndVars(noDoubleSpaces);
  const parsed = elparser.parse(spacesBeforeVariables);
  const rawDependencies = getDependencies(parsed);
  // check if it's a native function with "isNativeFunction(functionSymbol)"
  const dependencies = removeDuplicatedDependencies(rawDependencies)
  return dependencies;
};

module.exports = {
  getPrevChar,
  getNextChar,
  splitCodePerLine,
  removeLineComments,
  removeComments,
  splitInChunks,
  removeTabulationsAndNewLines,
  parseLisp
};