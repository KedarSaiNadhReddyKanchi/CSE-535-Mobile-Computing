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

public class CSVFileReaderModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    public CSVFileReaderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "CSVFileReaderModule";
    }

    @ReactMethod
    public void readCSVFile(final Callback callback) {
        try {
            InputStream inputStream = getReactApplicationContext().getAssets().open("CSVBreathe19.csv");
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            String line;
//            List<String[]> csvData = new ArrayList<>();
            System.out.println("The file has been read : ");
            System.out.println(reader);
            WritableArray writableArray = Arguments.createArray();

            while ((line = reader.readLine()) != null) {
                String[] rowData = line.split(",");
                for (String cell : rowData) {
                    writableArray.pushString(cell);
                }
//                csvData.add(rowData);
            }

            reader.close();
            System.out.println("csvData extracted is as follows : ");

//            WritableArray writableArray = Arguments.createArray();
//            for (String[] row : csvData) {
//                WritableArray rowArray = Arguments.createArray();
//                for (String cell : row) {
//                    rowArray.pushString(cell);
//                }
//                writableArray.pushArray(rowArray);
//            }

            callback.invoke(null , writableArray);
        } catch (IOException e) {
            callback.invoke(e.getMessage().toString(), null);
        }
    }
}
