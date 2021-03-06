const coffeedoc2jsdoc = require('../src/index');
const fs = require('fs');

describe('Converter', () => {
  const converter = coffeedoc2jsdoc.Converter;

  describe('toJSDoc', () => {

    it('converts a CoffeeDoc block comment into a JSDoc 3 equivalent', (done) => {
      fs.readFile('./samples/sample-1.coffee', 'utf8', (error, data) => {
        if (error) {
          done.fail(error);
        } else {
          const comment = converter.toJSDoc(data)[0];
          expect(comment).toBeDefined();
          expect(comment.tagReturns.type).toBe(coffeedoc2jsdoc.TagLine.TYPE.RETURN);
          done();
        }
      });
    });

    xit('handles multiple block comments', (done) => {
      fs.readFile('./samples/sample-2.coffee', 'utf8', (error, data) => {
        if (error) {
          done.fail(error);
        } else {
          const comments = converter.toJSDoc(data);
          expect(comments.length).toBe(2);

          const firstComment = comments[0];
          const secondComment = comments[1];

          let expected = `/**\n * Construct a new asset for the asset service.\n * @param {Object} config - Asset configuration\n * @returns {undefined} No return value\n */`;
          expect(firstComment.getJSDoc()).toBe(expected);

          expected = `/**\n * Sets the image payload of the asset.\n * @param {Object} image - Image object to be set on the asset entity\n * @returns {undefined} No return value\n */`;
          expect(secondComment.getJSDoc()).toBe(expected);

          done();
        }
      });
    });

  });

});

describe('TagLine', () => {
  describe('lintParamType', () => {
    it('converts "Integer" into "number"', () => {
      const type = '@return';
      const content = '[Integer] The answer to life, the universe and everything.';
      const tagLine = new coffeedoc2jsdoc.TagLine(type, content);
      tagLine.getJSDoc();
      expect(tagLine.parameter.type).toBe('number');
    });

    it('makes primitive types lowercase', () => {
      const type = '@return';
      const content = '[Boolean] True, if promise is valid.';
      const tagLine = new coffeedoc2jsdoc.TagLine(type, content);
      tagLine.getJSDoc();
      expect(tagLine.parameter.type).toBe('boolean');
    });

    it('converts primitive types in array declarations', () => {
      const type = '@param';
      const content = 'user_ids [Array<String>] IDs of users (excluding the requestor) to be part of the conversation';
      const tagLine = new coffeedoc2jsdoc.TagLine(type, content);
      tagLine.getJSDoc();
      expect(tagLine.parameter.type).toBe('Array<string>');
    });
  });
});
