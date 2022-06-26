# jsx-to-str
Very simple and tiny jsx to string converter

## Installation

```
npm install jsx-to-str
```

## tsconfig.json
```
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
```

## Through directive
If you cannot or don't want to set `jsxFactory` in `tsconfig.json`, in every jsx file add directives:
```
/** @jsx h */
/** @jsxFrag Fragment */
```

## JSX
In every jsx file import `jsx-to-str`
```
import { h, Fragment } from "jsx-to-str";
```
