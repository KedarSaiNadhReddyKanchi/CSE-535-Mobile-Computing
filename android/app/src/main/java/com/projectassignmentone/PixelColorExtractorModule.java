// PixelColorExtractorModule.java

package com.projectassignmentone;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.BitmapFactory;
import android.util.Base64;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class PixelColorExtractorModule extends ReactContextBaseJavaModule {

    public PixelColorExtractorModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "PixelColorExtractorModule";
    }

    @ReactMethod
    public void getPixelColorFromBase64(String base64String, int x, int y, Promise promise) {
        try {
            // Decode the base64 string into a Bitmap
            byte[] decodedString = Base64.decode(base64String, Base64.DEFAULT);
            Bitmap bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);

            // Get the pixel color at the specified coordinates
            int pixel = bitmap.getPixel(x, y);

            // Extract the ARGB values
            int alpha = Color.alpha(pixel);
            int red = Color.red(pixel);
            int green = Color.green(pixel);
            int blue = Color.blue(pixel);

            // Create a response object
            String color = String.format("#%02x%02x%02x%02x", alpha, red, green, blue);

            // Create a response object
            WritableMap resultMap = Arguments.createMap();
            resultMap.putInt("alpha", alpha);
            resultMap.putInt("red", red);
            resultMap.putInt("green", green);
            resultMap.putInt("blue", blue);

            promise.resolve(resultMap);

//            promise.resolve(color);
        } catch (Exception e) {
            promise.reject("PIXEL_COLOR_ERROR", e.getMessage());
        }
    }
}
