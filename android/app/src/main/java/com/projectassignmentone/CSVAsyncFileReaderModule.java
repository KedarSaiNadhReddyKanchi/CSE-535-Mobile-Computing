package com.projectassignmentone;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import android.content.Context;
import java.io.File;
import java.io.FileOutputStream;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import android.graphics.Color;
import android.graphics.BitmapFactory;
import android.util.Base64;
import com.facebook.react.bridge.Arguments;
import android.net.Uri;
import android.content.ContentResolver;
import android.database.Cursor;
import android.os.AsyncTask;
import android.provider.MediaStore;
import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;
import com.facebook.react.bridge.Callback;
import android.content.res.AssetManager;

public class CSVAsyncFileReaderModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private Callback callback;

    public CSVAsyncFileReaderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "CSVAsyncFileReaderModule";
    }

    @ReactMethod
    public void readCSVFile(final Callback callback) {
        this.callback = callback;
        try {
            ExtractRespiratoryRate task = new ExtractRespiratoryRate();
            task.execute();
        } catch (Exception e) {
            handleExtractionError(e.toString());
        }
    }

    // Helper method to handle errors and invoke the callback
    private void handleExtractionError(String errorMessage) {
        if (callback != null) {
            callback.invoke(errorMessage, null);
        }
    }

    private class ExtractRespiratoryRate extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            try {
                InputStream inputStream = getReactApplicationContext().getAssets().open("CSVBreathe19.csv");
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                String line;
                WritableArray writableArray = Arguments.createArray();

                while ((line = reader.readLine()) != null) {
                    String[] rowData = line.split(",");
                    for (String cell : rowData) {
                        writableArray.pushString(cell);
                    }
                }
                reader.close();

                int sampleLength = (int) writableArray.size();
                System.out.println("csv async file debug step - 0 the writableArray size calculated is " + sampleLength);
                double split = sampleLength / 3;
                int x_index = (int) Math.floor(split);
                int y_index = x_index + x_index;
                int z_index = y_index;
                System.out.println("csv async file debug step - 1 split x_index y_index z_index " + split + " " + x_index + " " + y_index + " " + z_index) ;
//                WritableArray accelValuesX = Arguments.createArray();
//                WritableArray accelValuesY = Arguments.createArray();
//                WritableArray accelValuesZ = Arguments.createArray();
                List<Double> accelValuesX = new ArrayList<>();
                List<Double> accelValuesY = new ArrayList<>();
                List<Double> accelValuesZ = new ArrayList<>();
                System.out.println("csv async file debug step - 2");

                for (int i = 0; i < writableArray.size(); i++) {
                    String element = writableArray.getString(i);
                    System.out.println("csv async file debug step - 2.1 - element " + element);
                    double reading_value = Double.parseDouble(element);
                    System.out.println("csv async file debug step - 2.2 - reading_value " + reading_value);
                    if (i < x_index) {
                        accelValuesX.add(reading_value);
                    } else if (((i < y_index))) {
                        accelValuesY.add(reading_value);
                    } else {
                        accelValuesZ.add(reading_value);
                    }
                }
                System.out.println("csv async file debug step - 3");
                System.out.println("csv async file debug step - 3 accelValuesX " + accelValuesX.size());
                System.out.println("csv async file debug step - 3 accelValuesY" + accelValuesY.size());
                System.out.println("csv async file debug step - 3 accelValuesZ" + accelValuesZ.size());
                double previousValue = 0;
                double currentValue = 0;

                double xvalue_29th_second = Math.pow(accelValuesX.get(29), 2);
                System.out.println("csv async file debug step - 4 xvalue_29th_second" + xvalue_29th_second);

                double yvalue_29th_second = Math.pow(accelValuesY.get(29), 2);
                System.out.println("csv async file debug step - 4 yvalue_29th_second" + yvalue_29th_second);

                double zvalue_29th_second = Math.pow(accelValuesZ.get(29), 2);
                System.out.println("csv async file debug step - 4 zvalue_29th_second" + zvalue_29th_second);

                previousValue = Math.sqrt(xvalue_29th_second + yvalue_29th_second + zvalue_29th_second);
                System.out.println("csv async file debug step - 5 the previous value calculated is " + previousValue);

                int k = 0;

                for (int i = 30; i < x_index; i++) {
                    double value1 = Math.pow(accelValuesX.get(i), 2);
                    double value2 = Math.pow(accelValuesY.get(i), 2);
                    double value3 = Math.pow(accelValuesZ.get(i), 2);
                    currentValue = Math.sqrt(value1 + value2 + value3);
                    if (Math.abs(previousValue - currentValue) > 0.088) {
                        k++;
                    }
                    previousValue = currentValue;
                }
                double ret = k / 45.00;
                System.out.println("csv async file debug step - 6 the ret value calculated is " + ret);

                double result = Math.round(ret * 30);
                System.out.println("csv async file debug step - 7 the result value calculated is " + result);

                return String.valueOf(result);
            } catch (Exception e) {
                return e.toString();
            }
        }

        @Override
        protected void onPostExecute(String result) {
            handleExtractionResult(result);
        }

        // Helper method to handle the extraction result and invoke the callback
        private void handleExtractionResult(String result) {
            if (callback != null) {
                if (result != null) {
                    callback.invoke(null, result);
                } else {
                    callback.invoke("Error", null);
                }
            }
        }
    }

}
