module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
    'module-resolver',
    {
     root: ['./android/app/src'],
     extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json' , '.csv'],
     alias: {
     tests: ['./tests/'],
     "@components": "./android/app/src/components",
     }
    }
    ]
    ]
};
