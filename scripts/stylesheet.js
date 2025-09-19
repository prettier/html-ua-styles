import * as cssTree from 'css-tree';
import normalizeSelector from './normalize-selector.js';

const knownKeys = new Map(
  [
    ['Declaration', ['type', 'loc', 'important', 'property', 'value']],
    ['Atrule', ['type', 'loc', 'name', 'prelude', 'block']],
  ].map(([type, keys]) => [type, new Set(keys)]),
);

const assertNodeType = (node, type) => {
  if (node.type !== type) {
    throw Object.assign(new Error('Unexpected node type'), { node });
  }

  const keys = knownKeys.get(node.type);
  if (keys) {
    for (const key of Object.keys(node)) {
      if (!keys.has(key)) {
        throw new Error(`Unexpected key '${key}' in '${node.type}'.`);
      }
    }
  }
};

class Stylesheet {
  #tree;

  #text;

  constructor(text) {
    const tree = cssTree.parse(text, {
      positions: true,
      parseValue: false,
      parseAtrulePrelude: false,
    });

    this.#tree = tree;
    this.#text = text;
  }

  toJSON() {
    return this.stringify();
  }

  stringify() {
    const ast = this.#tree;
    assertNodeType(ast, 'StyleSheet');

    return Array.from(ast.children, (node) =>
      this.#stringifyRuleOrAtRule(node),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  #stringifyDeclaration(node) {
    const { property, important, value } = node;

    assertNodeType(node, 'Declaration');
    assertNodeType(value, 'Raw');

    const style = { property, value: value.value };

    if (important) {
      node.important = true;
    }

    return style;
  }

  #stringifySelector(node) {
    if (node.type !== 'Selector') {
      throw new Error('Unexpected node');
    }

    const text = this.#text.slice(node.loc.start.offset, node.loc.end.offset);
    return normalizeSelector(text);
  }

  #stringifyRule(node) {
    const { prelude, block } = node;
    assertNodeType(node, 'Rule');
    assertNodeType(prelude, 'SelectorList');
    assertNodeType(block, 'Block');

    return {
      type: 'Styles',
      selectors: Array.from(prelude.children, (node) =>
        this.#stringifySelector(node),
      ),
      styles: Array.from(block.children, (node) =>
        this.#stringifyDeclaration(node),
      ),
    };
  }

  #stringifyAtRule(node) {
    const { prelude, block, name } = node;

    assertNodeType(node, 'Atrule');
    assertNodeType(prelude, 'Raw');
    assertNodeType(block, 'Block');

    if (name !== 'media') {
      throw Object.assign(new Error('Unexpected node'), { node });
    }

    return {
      type: 'MediaQuery',
      value: prelude.value,
      rules: Array.from(block.children, (rule) => this.#stringifyRule(rule)),
    };
  }

  #stringifyRuleOrAtRule(node) {
    switch (node.type) {
      case 'Atrule':
        return this.#stringifyAtRule(node);
      case 'Rule':
        return this.#stringifyRule(node);
      default:
        throw Object.assign(new Error('Unexpected node'), { node });
    }
  }
}

export default Stylesheet;
