# Resources

Mod, and library, that adds various resources in order to encourage item reuse.

# How it works

# How to use
## As an item mod
See `scripts/builtin.js` for a list of items.

Use items in the format `resources-ID` where ID is the JSON key of the object.

Example: `"outputItem": "resources-bronze/2"`

## As a library for your own items
See example code below:
```js
const res = this.global.resources;
res.add("cool-alloy", "ingot-alloy", Color.valueOf("#00aaff"), {});
// Or JSON style
res.add({
	"cool-alloy": {
		"mask": "ingot-alloy",
		"color": "#00aaff"
	}
});
```

Then add bundles as needed:
```
item.coolmod-cool-alloy.name = Cool Alloy
item.coolmod-cool-alloy.description = B)
```

## Notes

By default, the new item's type is set to `ItemType.material`.

If you do not want this, override it with `"def": {"type": ItemType.resource}`

Color should be the brightest part of the texture.


For JSON style item adding, the object argument must contain any number of objects in the following formats:
```json
"itemname": {
	"color": "color",
	"mask": "mask-texture",
	"def": {
		"extra": "fields for Item"
	}
}
```
OR
```
"itemname": "color"
```

The mask may be one of the following:
* ingot-alloy (Surge Alloy based)
* ingot-dull (Lead based)
* ingot-rare (Titanium based)
* ingot-shiny (Copper based, default)

Color may be:
* #rrggbbaa
* #rrggbb
* color name, see Color.java and Pal.java
* 32 bit int color value in decimal
* an explicitly defined `Color` value

If you see a color of #FF00FF, (#FF00FFFF in rgba) it means that your colour failed to parse.


add(String, String, Color, Object) returns the newly created Item.

add(Object<itemname, Object>) returns an object of <itemname> -> Item