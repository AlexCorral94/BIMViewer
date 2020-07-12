    //Remove element from scene
    function removeEntity(object) {
        var selectedObject = scene.getObjectByName(object.name);
        selectedObject.parent.remove( selectedObject );
    }

    //Change Material Color
    function ChangeColor(object, hexColor) {
        var rgbs = HEX2RGB(hexColor);
        if(oringinMaterial != undefined) {
            const rgbColor = hexToRgb(hexColor.replace('#', ''));
            const intColor = swiftCol(rgbColor);
            var materialIndex = null;
            model.materials.find((material, index) => {
                if (material.uuid == oringinMaterial.uuid) {
                    materialIndex = index;
                    return index;
                }
            });
            model.materials[materialIndex].color = intColor;
            // db.collection('models').doc('test1').update(model);
            oringinMaterial.color = {r:rgbs[0], g:rgbs[1], b:rgbs[2]};
        }

    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }

    function swiftCol (rgb) {
        return (  rgb.r ) << 16
        | (  rgb.g ) << 8
        | rgb.b;
    }

    function HEX2RGB (hex) {
        "use strict";
        if (hex.charAt(0) === '#') {
            hex = hex.substr(1);
        }
        if ((hex.length < 2) || (hex.length > 6)) {
            return false;
        }
        var values = hex.split(''),
            r,
            g,
            b;

        if (hex.length === 2) {
            r = parseInt(values[0].toString() + values[1].toString(), 16);
            g = r;
            b = r;
        } else if (hex.length === 3) {
            r = parseInt(values[0].toString() + values[0].toString(), 16);
            g = parseInt(values[1].toString() + values[1].toString(), 16);
            b = parseInt(values[2].toString() + values[2].toString(), 16);
        } else if (hex.length === 6) {
            r = parseInt(values[0].toString() + values[1].toString(), 16);
            g = parseInt(values[2].toString() + values[3].toString(), 16);
            b = parseInt(values[4].toString() + values[5].toString(), 16);
        } else {
            return false;
        }
        return [r/255, g/255, b/255];
    }