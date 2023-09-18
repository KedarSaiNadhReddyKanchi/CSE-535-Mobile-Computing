package com.projectassignmentone;

import androidx.annotation.NonNull;
import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Promise;
import android.graphics.Color;
import android.graphics.BitmapFactory;
import android.util.Base64;
import com.facebook.react.bridge.Arguments;
import android.net.Uri;
import android.content.ContentResolver;
import android.database.Cursor;
import android.os.AsyncTask;
import android.provider.MediaStore;
import java.util.ArrayList;
import java.util.List;
import android.content.Context;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import android.content.res.AssetManager;

public class VideoFrameExtractorModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private static final String ASSET_PREFIX = "asset:///";

    public VideoFrameExtractorModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "VideoFrameExtractorModule";
    }

    @ReactMethod
    public void extractFrames(final Callback callback) {
        try {
            MediaMetadataRetriever retriever = new MediaMetadataRetriever();
//            retriever.setDataSource(videoPath);

            File destinationDir = new File(reactContext.getFilesDir(), "videos");
            if (!destinationDir.exists()) {
                destinationDir.mkdirs();
            }

            // Specify the destination path for the copied video
            File destinationFile = new File(destinationDir, "heartrateprovidedvideo.mp4");

            // Copy the video from assets to the local directory
            AssetManager assetManager = reactContext.getAssets();
            InputStream inputStream = assetManager.open("heartrateprovidedvideo.mp4");
            FileOutputStream outputStream = new FileOutputStream(destinationFile);
            byte[] buffer = new byte[1024];
            int read;
            while ((read = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, read);
            }
            inputStream.close();
            outputStream.close();
            retriever.setDataSource(destinationFile.getAbsolutePath());

            System.out.println("I reached here");
            long duration = Long.parseLong(retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION));
            long frameTime = 1000; // Extract a frame every second (adjust as needed)
            long currentTime = 0;
            System.out.println("Total duration of the video extracted in the helper code is = "  + duration);

            WritableArray frames = Arguments.createArray();
//            List<Bitmap> frameList = new ArrayList<>();
            long redBucket = 0;
            long pixelCount = 0;
            List<Long> a = new ArrayList<>();

            while (currentTime < duration) {
                Bitmap frame = retriever.getFrameAtTime(currentTime * 1000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
//                frameList.add(bitmap);
                redBucket = 0;

                if (frame != null) {
                    //WritableMap frameInfo = Arguments.createMap();
                    //frameInfo.putInt("width", frame.getWidth());
                    //frameInfo.putInt("height", frame.getHeight());
                    System.out.println("I reached the frameInfo");
                    System.out.println("frame dimensions : width = " + frame.getWidth() + " and height = " + + frame.getHeight());
                    // Iterate through each pixel in the frame and get its value
                    //WritableArray pixels = Arguments.createArray();
                    int width_starting_point = 30;
                    int width_ending_point = frame.getWidth() - 30;
                    int heigth_starting_point = 60;
                    int height_ending_point = frame.getHeight() - 60;
                    for (int x = width_starting_point; x < width_ending_point; x++) {
                        for (int y = heigth_starting_point; y < height_ending_point; y++) {
                            int pixelColor = frame.getPixel(x, y);
                            //pixels.pushInt(pixelColor);
                            pixelCount++;
                            redBucket += Color.red(pixelColor) + Color.blue(pixelColor) + Color.green(pixelColor);
                        }
                    }

                    //frameInfo.putArray("pixels", pixels);
                    //frames.pushMap(frameInfo);
                    a.add(redBucket);
                }

                currentTime += frameTime;
            }
            System.out.println("I reached the end - part 1");
            List<Long> b = new ArrayList<>();
            for (int i = 0; i < a.size() - 5; i++) {
                long temp = (a.get(i) + a.get(i + 1) + a.get(i + 2) + a.get(i + 3) + a.get(i + 4)) / 4;
                b.add(temp);
            }

            long x = b.get(0);
            int count = 0;

            for (int i = 1; i < b.size() - 1; i++) {
                long p = b.get(i);
                if ((p - x) > 3500) {
                    count++;
                }
                x = b.get(i);
            }

            int rate = (int) ((count * 60) / 81);

            System.out.println("I reached the end - part 2");
            callback.invoke(null, String.valueOf(rate));
        } catch (Exception e) {
            callback.invoke(e.toString(), null);
        }
    }
}
