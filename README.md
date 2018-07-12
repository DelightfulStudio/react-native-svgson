# react-native-svgson

 - Render SVG from a JSON definition generated by https://github.com/elrumordelaluz/svgson
 - SVG rendering through [Expo.Svg](https://docs.expo.io/versions/latest/sdk/svg) or [react-native-svg](https://github.com/react-native-community/react-native-svg)
 - Override styling of SVG elements by element type or ID

Based on [react-native-svgx](https://github.com/jasancheg/react-native-svgx) by Jose Antonio Sanchez.


## Example

```javascript
import * as Svg from 'react-native-svg';
// or import { Svg } from 'expo';
import SvgJson from 'react-native-svgson';

import checkmark from '../icons/checkmark.json';

function renderCheckmark() {
  const styles = {
    // override default dimensions
    height: 38,
    width: 38,
    path: {
        fill: '#000000' // all <path> elements
    },
    '#circle-path': {
      fill: '#222222' // path with id="circle-path"
    }
  };

  return <SvgJson svgLib={Svg} data={checkmark} style={styles} />;
}
```
