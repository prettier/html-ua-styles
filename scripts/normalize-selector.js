import * as CSSwhat from 'css-what';

function normalizeSelector(selector) {
  const ast = CSSwhat.parse(selector, { context: 'selector' });

  return CSSwhat.stringify(ast);
}

export default normalizeSelector;
