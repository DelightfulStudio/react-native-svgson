import React from 'react';
import camelcase from 'camelcase';

const supportedTagTypes = [
  'LinearGradient',
  'RadialGradient',
  'Polyline',
  'Polygon',
  'Ellipse',
  'Circle',
  'Symbol',
  'Line',
  'Path',
  'Rect',
  'Text',
  'Defs',
  'Stop',
  'Use',
  'G',
];

const parseTransform = (attr) => {
  const b = {};
  attr.match(/(\w+\((-?\d+\.?\d*e?-?\d*\s?)+\))+/g).forEach((m) => {
    const c = m.match(/[\w.-]+/g);
    b[c.shift()] = c.join(',');
  });
  return b;
};

const renderSvgChilds = (Svg, childs, style) => childs.map((child, i) => {
  // don't render if not supported tag type
  const nodeType = camelcase(child.name);
  if (!supportedTagTypes.includes(nodeType)) return null;

  const Node = Svg[nodeType];
  let currentAttrs = { ...child.attrs };

  // parse transforms
  if (currentAttrs.transform) {
    currentAttrs = {
      ...currentAttrs,
      transform: parseTransform(currentAttrs.transform),
    };
  }

  // apply custom style
  currentAttrs = { ...currentAttrs, ...style[child.name], ...style[`#${currentAttrs.id}`] };

  // don't render hidden elements
  if (currentAttrs.display === 'none') return null;

  return (
    <Node {...currentAttrs} key={currentAttrs.id || i}>
      {child.childs && child.childs.length ? renderSvgChilds(Svg, child.childs, style) : null}
    </Node>
  );
});


export const renderSvg = ({ component: Svg, data, style = {} }) => {
  // avoid render on invalid Svg definition
  if (!Svg || !data || !data.name || data.name !== 'svg') return null;

  // Svg props
  const svgProps = data.attrs || {};
  // overwrite height and width if provided
  if (style.width) svgProps.width = style.width;
  if (style.height) svgProps.height = style.height;

  return (
    <Svg {...svgProps}>
      {renderSvgChilds(Svg, data.childs, style)}
    </Svg>
  );
};


export default renderSvg;
