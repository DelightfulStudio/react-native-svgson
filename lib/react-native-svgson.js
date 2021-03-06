import React from 'react';


const parseTransform = (attr) => {
  const b = {};
  attr.match(/(\w+\((-?\d+\.?\d*e?-?\d*\s?)+\))+/g).forEach((m) => {
    const c = m.match(/[\w.-]+/g);
    b[c.shift()] = c.join(',');
  });
  return b;
};


const capitalizeFirstLetter = str => str[0].toUpperCase() + str.slice(1);

const renderSvgChilds = (svgLib, childs, style) => childs.map((child, i) => {
  const nodeType = capitalizeFirstLetter(child.name);
  const Node = svgLib[nodeType];
  if (!Node) return null;

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
      {child.childs && child.childs.length ? renderSvgChilds(svgLib, child.childs, style) : null}
    </Node>
  );
});


export const renderSvg = ({ svgLib, data, style = {} }) => {
  // avoid render on invalid Svg definition
  if (!svgLib || !data || !data.name || data.name !== 'svg') return null;

  // Svg props
  const svgProps = data.attrs || {};

  // apply top-level styles if any
  const svgStyle = style.svg;
  if (svgStyle) {
    svgProps.style = svgStyle;
    // also sync top-level height and width props, if any
    if (svgStyle.width) svgProps.width = svgStyle.width;
    if (svgStyle.height) svgProps.height = svgStyle.height;
  }

  // handle namespacing differences between Expo and react-native-svg
  const Svg = svgLib.Svg || svgLib;
  return (
    <Svg {...svgProps}>
      {renderSvgChilds(svgLib, data.childs, style)}
    </Svg>
  );
};


export default renderSvg;
