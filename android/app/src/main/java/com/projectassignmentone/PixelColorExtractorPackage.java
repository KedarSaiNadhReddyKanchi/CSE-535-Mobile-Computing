// PixelColorExtractorPackage.java

package com.projectassignmentone;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class PixelColorExtractorPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        // Register the module here
        modules.add(new PixelColorExtractorModule(reactContext));
        modules.add(new VideoFrameExtractorModule(reactContext));
        modules.add(new FrameExtractorAsyncTaskModule(reactContext));
        modules.add(new CSVFileReaderModule(reactContext));
        modules.add(new CSVAsyncFileReaderModule(reactContext));
        return modules;
    }

//    @Override
//    public List<Class<? extends JavaScriptModule>> createJSModules() {
//        return Collections.emptyList();
//    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
