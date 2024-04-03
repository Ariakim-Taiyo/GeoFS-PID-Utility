# PID Utility:
This tool is designed to be used to debug PID controllers in GeoFS.\
This is useful for autopilot systems, FBW systems, and other similar systems that require the use of PID controllers.

## Interface:
Copy the contents of [index.js](https://github.com/Ariakim-Taiyo/GeoFS-PID-Utility/blob/main/index.js) into the DevTools Console (F12).\
*The code is not obfuscated or minified, so you may easily verify the legitimacy of the code before using it.*

**Upon loading, a panel will appear on the left side of the screen. This panel contains the graph, which displays a value of your choice:**
![image](https://github.com/Ariakim-Taiyo/GeoFS-PID-Utility/assets/79466778/0bc1726f-78c1-4d87-9c80-351eafafff19)

**As well as a few sliders which are used to make adjustments to the PID controllers:**\
![image](https://github.com/Ariakim-Taiyo/GeoFS-PID-Utility/assets/79466778/34fe9372-eca7-47d2-82c8-3c4d42595f10)\
*Note the order of the sliders; from left to right: P I D.*\
These sliders are scrollable, so you can make fine adjustments with the scroll wheel (0.01 unit resolution).

## Debugging AP PIDs:
In order to debug autopilot PIDs, you must set a couple of values first.

```js
let valueToGraph = "atilt"; //The animation value to use
let bounds = [-180, 180]; //Lower / Upper bounds of the graph.
let valueGraphed;           //Leave blank
let graphTitle = "Pitch";   //Title of the graph. Purely aesthetic.
let apObject = geofs.autopilot.PIDs.pitchAngle; //Change this to other PID objects if you want to debug those.
```
`valueToGraph` is one of the properties under `geofs.animation.values`, and is responsible for specifying which variable to display on the graph.\
`bounds` is the vertical scale of the graph. **You will want to change this to reflect the animation value that you are displaying.**\
`valueGraphed` may be ignored in this case. It will set itself later.\
`graphTitle` is the name of the graph. You don't actually have to set this if you're feeling lazy.\
`apObject` is the most important value to set; it specifies which AP PID to modify. you can choose from any of the following: 
```js
//Object.keys(geofs.autopilot.PIDs) ->
[
    "pitchAngle",
    "elevatorPitch",
    "bankAngle",
    "aileronsRoll",
    "throttle"
]
```

The default settings will modify your pitch angle controller, and display the pitch angle on the graph with an upper and lower limit of 180.

## Debugging other PIDs:
**This will only work with PID controllers that use the GeoFS PID system!**
When debugging other PIDs, it will be necessary to modify the functions slightly.\
Replace lines 8 - 10 with this, making sure to add your own value to replace the comment.
```js
//lines 8 - 10
let valueSetInterval = setInterval(function(){
  valueGraphed = //your value here
},100)
```
You can then change the path of the `apObject` to your own PID. You must ensure that the PID object is either the default GeoFS PID system, or follows this format:
```js
// new PID(0, 0, 0) ->
{
    "_kp": 0,
    "_ki": 0,
    "_kd": 0,
    "_previousInput": 0,
    "_previousError": 0,
    "_integral": 0,
    "_setPoint": 0,
    "_minOutput": 0,
    "_maxOutput": 0
}
```
## Extracting Values:
There are two methods of extracting your final values.
1. Copy them from the P, I, and D labels placed above the sliders.
2. Get the value of `apObject` in the console.

Then you can plug those into the aircraft definition file, or into your plugin for FBW controls.
