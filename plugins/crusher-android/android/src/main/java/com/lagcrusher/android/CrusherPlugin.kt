package com.lagcrusher.android

import android.app.Activity
import android.content.Intent
import android.os.Build
import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.Plugin

@TauriPlugin
class CrusherPlugin(activity: Activity) : Plugin(activity) {

    @Command
    fun startService(invoke: Invoke) {
        try {
            val context = activity.applicationContext
            val intent = Intent(context, CrusherService::class.java).apply {
                action = CrusherService.ACTION_START
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
            invoke.resolve()
        } catch (e: Exception) {
            invoke.reject("failed to start service: ${e.message}")
        }
    }

    @Command
    fun stopService(invoke: Invoke) {
        try {
            val context = activity.applicationContext
            val intent = Intent(context, CrusherService::class.java).apply {
                action = CrusherService.ACTION_STOP
            }
            context.startService(intent)
            invoke.resolve()
        } catch (e: Exception) {
            invoke.reject("failed to stop service: ${e.message}")
        }
    }

    @Command
    fun updateNotification(invoke: Invoke) {
        try {
            val latency = invoke.getString("latency")
                ?: return invoke.reject("missing argument: latency")
            val pingCount = invoke.getString("pingCount")
                ?: return invoke.reject("missing argument: pingCount")
            CrusherService.updateNotification(activity, latency, pingCount)
            invoke.resolve()
        } catch (e: Exception) {
            invoke.reject("failed to update notification: ${e.message}")
        }
    }
}
