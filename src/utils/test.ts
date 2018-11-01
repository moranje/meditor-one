const nearley = require('nearley');
const grammar = require('./grammer');

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// Parse something!
parser.feed('This is $1 very, \n $+ simple $=1 snippet');

// parser.results is an array of possible parsings.
console.log(JSON.stringify(parser.results)); // [[[[ "foo" ],"\n" ]]]
