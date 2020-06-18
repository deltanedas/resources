/*
	Copyright (c) DeltaNedas 2020

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
const PixmapTextureData = Packages.arc.graphics.gl.PixmapTextureData;
const res = this.global.resources;

const error = Color.valueOf("#ff00ff");

res.masks = {};

res.Item = {
	createIcons(packer) {
		this.super$createIcons(packer);

		// Get the mas
		const color = this.color;
		var mask = res.masks[this.mask];
		if(mask === undefined){ // Cache mask textures to save cpu
			mask = Core.atlas.getPixmap(this.mask);
			res.masks[this.mask] = mask;
		}

		// Colour the mask, pixel by pixel
		var newTexture = new Pixmap(32, 32);
		var pixel = new Color(), x, y;
		for(x = 0; x < 32; x++){
			for(y = 0; y < 32; y++){
				pixel.set(mask.getPixel(x, y));
				if(pixel.a > 0){
					pixel.mul(color);
					pixel.a *= color.a; // For ghost items :o
					newTexture.draw(x, y, pixel);
				}
			}
		}

		// Do any extra processing
		if (this.layers) {
			var layers = [];
			for (var i in this.layers) {
				layers[i] = Core.atlas.getPixmap(this.layers[i]);
			}

			var lPix = new Color();
			for (x = 0; x < 32; x++) {
				for (y = 0; y < 32; y++) {
					pixel.set(newTexture.getPixel(x, y));
					for (i in layers) {
						if (pixel.a < 1) {
							lPix.set(layers[i].getPixel(x, y));
							pixel.add(lPix);
							pixel.a += lPix.a;
						}
					}
					newTexture.draw(x, y, pixel);
				}
			}
		}
		// Add it to the atlas
		packer.add(MultiPacker.PageType.main, "item-" + this.name, newTexture);
	},
	type: ItemType.material
};

res.add = function(name, mask, color, def){
	if(typeof(name) === "object"){
		const items = name;
		var ret = {};
		var obj, itemname, color, mask, def;
		for(itemname in items){
			obj = items[itemname];
			color = obj;
			mask = "resources-ingot-shiny";
			def = {};
			if(typeof(obj) === "object"){
				color = obj.color || error;
				mask = obj.mask || "resources-ingot-shiny",
				def = obj.def || def;
			}

			// Allow various types of colors to be parsed
			if(typeof(color) === "string"){
				if(color[0] === '#'){
					color = Color.valueOf(color); // "color": "#00aaff"
				}else{
					color = Colors.get(color); // "color": "royal"
				}
			}else if (color instanceof Color){
				color = new Color(color); // "color": 123456
			}

			ret[itemname] = res.add(
				itemname,
				mask,
				color || error,
				def);
		}

		return ret;
	}

	var itemDef = Object.create(res.Item);
	Object.assign(itemDef, def);
	var item = extendContent(Item, name, itemDef);
	item.mask = mask;
	item.color = color;
	item.type = itemDef.type;
	return item;
}

module.exports = res
this.global.resources = res
